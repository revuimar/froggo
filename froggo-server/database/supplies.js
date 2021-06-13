const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize }  = require('./connection');
const { Branch } = require('./branch');

class Supplies extends Model {}

Supplies.init({
    // Idea behind supplies is to have null FK if it's warehouse stock
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true //SERIALiser for postgres
    },
    item_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lastsync:{
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'supplies' // We need to choose the model name
});

async function getSupplies() {
    return Supplies.findAll({
            order: [['id','ASC']]
            //offset: (page-1) * items,
            //limit: page * items
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error);
        throw error
    });
};

async function createSupply(item_name, quantity,branch_id){
    return Supplies.create(
        {
            item_name: item_name,
            quantity: quantity,
            branch_id: branch_id,
            lastsync: null
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createSupplies(supplies){
    return Supplies.bulkCreate(
        supplies,{
            updateOnDuplicate: ["item_name"],
            returning: true
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error)
        throw error;
    });
}

async function updateRow(item_name, supply, branch_name) {
    Branch.findOne({
        where: {branch_name: branch_name}
    }).then((branch)=>{
        return Supplies
            .findOne({
                where: {
                    [Op.and]: [
                        {item_name: item_name}
                    ]
                } })
            .then(function(obj) {
                // update
                supply['branch_id'] = parseInt(branch.id);
                if(obj)
                    return obj.update(supply);
                // insert
                return Supplies.create(supply);
            });
    })

}

async function syncSupplies(supplies,branch){
    console.log('from db: ',branch);
    supplies.forEach(async supply => {
        supply['lastsync'] = await sequelize.fn('NOW');
        await updateRow(supply.item_name,supply,branch.branch_name).catch(()=>{
            return null
        })
    });
    return supplies;
}


async function stageSuppliesSyncPayload(branch_name){
    console.log("from DB: ",branch_name);
    return  Branch.findOne({
        where: {branch_name: branch_name}
    }).then(async (branch)=>{
        console.log("found branch ",branch.dataValues.id);
        return Supplies.findAll({
            where: {
                    branch_id: parseInt(branch.dataValues.id),
                    [Op.or]: [
                        { lastsync: {[Op.lt]: sequelize.col('updatedAt')} },
                        { lastsync: {[Op.is]: null} }
                    ]
            },returning: true}
        ).then((result)=>{
            let supplies = []
            for(let i in result){
                supplies.push({
                    "item_name": result[i].dataValues.item_name,
                    "quantity": result[i].dataValues.quantity,
                })
            }
            return supplies;
        });
    });

}

async function updateSupplyLastSync(supplies,branch_name){
    try{
        supplies.forEach(async supply => {
            supply['lastsync'] = await sequelize.fn('NOW');
            updateRow(supply.item_name,supply,branch_name).catch((error)=> {
                throw error;
            });
        });
        return {"success": supplies}
    }catch (e) {
        return e;
    }
}

async function deleteSupplies(ids){
    await Supplies.destroy({
            where: {
                id: {
                    [Op.or]: ids
                }
            }
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error)
        throw error;
    });
}

async function createMockSupplies(){
    const supplies = [
        {"item_name": "Harnaś", "quantity": 50, "lastsync": null,"branch_id": 1},
        {"item_name": "Sok", "quantity": 30, "lastsync": null,"branch_id": 1},
        {"item_name": "Burak", "quantity": 320, "lastsync": null,"branch_id": 1},
        {"item_name": "Cebula", "quantity": 780, "lastsync": null,"branch_id": 1},
        {"item_name": "Kalarepa", "quantity": 322, "lastsync": null,"branch_id": 1},
        {"item_name": "Papierosy", "quantity": 80, "lastsync": null,"branch_id": 1},
        {"item_name": "Kalafiory", "quantity": 280, "lastsync": null,"branch_id": 1},
        {"item_name": "Zapiekanki", "quantity": 30, "lastsync": null,"branch_id": 1},
        {"item_name": "Grappa Ice", "quantity": 430, "lastsync": null,"branch_id": 1},
        {"item_name": "Lewandowski album pamiątkowy", "quantity": 30, "lastsync": null,"branch_id": 1}
    ]
    return Supplies.bulkCreate(
        supplies,{
            updateOnDuplicate: ["item_name"],
            returning: true
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        return  error;
    });
}

module.exports = {
    Supplies,
    getSupplies,
    createSupply,
    createSupplies,
    syncSupplies,
    stageSuppliesSyncPayload,
    updateSupplyLastSync,
    deleteSupplies,
    createMockSupplies
}
