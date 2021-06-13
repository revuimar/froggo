const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize } = require('./connection');


class Supplies extends Model {}

Supplies.init({
    // Idea behind supplies is to have null FK if it's warehouse stock
    item_id:{
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

async function getSupplies () {
    return Supplies.findAll({
            order: [['item_id','ASC']]
            //offset: (page-1) * items,
            //limit: page * items
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error);
        return error
    });
}

async function getSuppliesByItemName (item_name) {
    return Supplies.findAll({
            where: {
                item_name: item_name
            }
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        return error
    });
}

async function createSupplies(supplies){
    return Supplies.bulkCreate(
        supplies,{returning: true}
    ).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function createSupply(item_name, quantity){
    return Supplies.create(
        {
            item_name: item_name,
            quantity: quantity
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function updateSupplyQuantity(item_id,quantity){
    return Supplies.update(
        {quantity:quantity},{
            where: {item_id: item_id}
        }).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function updateRow(item_name, supply) {
    return Supplies.update(
        supply,
        {
            where: {item_name: item_name}
        }
    );
}
/*
// i am using lodash for easy Object mapping
function buildRowPromises(requestObject) {
    const promises = _.map(requestObject, (value, key) =>
        Promise.resolve().then(() => updateRow(key, value))
    );
    return promises;
}

//... expressjs code
async function updateSupplyLastSync(supplies) {
    for(let i in supplies){
        supplies[i]['lastsync'] = sequelize.literal('NOW()');
    }
    update(req, res)
    {
        if (!req.body.updatedValue) return res.status(501).send({message: 'ERROR FIELD EMPTY'});
        return Promise.all(buildRowPromises(req.body.updatedValue))
            .then(setting => Setting.findAll().then(settingResult => res.status(200).send(settingResult)))
            .catch(err => res.status(501).send(err));
    }
}*/

async function updateSupplyLastSync(supplies){
    try{
        supplies.forEach(async supply => {
            supply['lastsync'] = await sequelize.fn('NOW');
            updateRow(supply.item_name,supply).catch((error)=> {
                throw error;
            });
        });
        return {"success": supplies}
    }catch (e) {
        return e;
    }
}

async function updateSupplies(supplies){
    try{
        supplies.forEach(async supply => {
            updateRow(supply.item_name,supply).catch((error)=> {
                throw error;
            });
        });
        return {"success": supplies}
    }catch (e) {
        return e;
    }
}

async function stageSuppliesSyncPayload(){
    return Supplies.findAll({
        where: {
            [Op.or]: [
                { lastsync: {[Op.lt]: sequelize.col('updatedAt')} },
                { lastsync: {[Op.is]: null} }
            ]
        }}
    ).then((result)=>{
        let supplies = []
        for(let i in result){
            supplies.push({
                "item_name": result[i].dataValues.item_name,
                "quantity": result[i].dataValues.quantity,
            })
        }
        return supplies;
    },(error)=> {
        return error
    });
}

async function createMockSupplies(){
    const supplies = [
        {"item_name": "Harnaś", "quantity": 50, "lastsync": null},
        {"item_name": "Sok", "quantity": 30, "lastsync": null},
        {"item_name": "Burak", "quantity": 320, "lastsync": null},
        {"item_name": "Cebula", "quantity": 780, "lastsync": null},
        {"item_name": "Kalarepa", "quantity": 322, "lastsync": null},
        {"item_name": "Papierosy", "quantity": 80, "lastsync": null},
        {"item_name": "Kalafiory", "quantity": 280, "lastsync": null},
        {"item_name": "Zapiekanki", "quantity": 30, "lastsync": null},
        {"item_name": "Grappa Ice", "quantity": 430, "lastsync": null},
        {"item_name": "Lewandowski album pamiątkowy", "quantity": 30, "lastsync": null}
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
    getSuppliesByItemName,
    createSupplies,
    createSupply,
    updateSupplyQuantity,
    updateSupplyLastSync,
    updateSupplies,
    stageSuppliesSyncPayload,
    createMockSupplies
}

