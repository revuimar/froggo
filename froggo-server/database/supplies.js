const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize }  = require('./connection');


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
    }/*,
    last_update:{
        type: DataTypes.DATE,
        allowNull: true
    }*/
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
            last_update: Sequelize.fn('NOW'),
            branch_id: branch_id
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createSupplies(supplies){
    return Supplies.bulkCreate(
        supplies,{ returning: true }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error)
        throw error;
    });
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

module.exports = {
    Supplies,
    getSupplies,
    createSupply,
    createSupplies,
    deleteSupplies
}
