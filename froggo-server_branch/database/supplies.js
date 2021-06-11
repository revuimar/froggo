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

async function stageSuppliesSyncPayload(){
    return Supplies.findAll({
        where: {
            [Op.or]: [
                { lastsync: {[Op.lt]: sequelize.col('updatedAt')} },
                { lastsync: {[Op.is]: null} }
            ]
        }}
    ).then((result)=>{
        return result;
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
    stageSuppliesSyncPayload,
    createMockSupplies
}

