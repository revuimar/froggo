const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize } = require('./connection');

class Order extends Model {}

Order.init({
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true //SERIALiser for postgres
    },
    key: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    list: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    lastsync:{
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    sequelize,
    modelName: 'order'
});

async function getOrders() {
    return Order.findAll(
    ).then((result)=>{
        return result;
    },(error)=> {
        return error
    });
}

async function getOrderByKey(key) {
    return Order.findAll({
        where: {
            key: key
        }}
    ).then((result)=>{
        return result;
    },(error)=> {
        return error
    });
}

async function createOrder(key, list){
    return Order.create(
        {key: key, list: list,status: 0}
    ).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function bulkCreateOrders(){
    return Order.bulkCreate(orders,
        {
            updateOnDuplicate: ["key"]
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function updateOrderStatusbyId(order_id,status){
    return Order.update(
        {status:status},{
            where: {
                id:order_id
            }
        }).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function stageOrderSyncPayload(){
    return Order.findAll({
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

async function createMockOrders(){
    const orders =
        [
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 33},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 43}
                ],
                lastsync: null,
                status: 0
            },
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 42},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 42},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 41}
                ],
                lastsync: null,
                status: 0
            },
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 53},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 34},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 23}
                ],
                lastsync: null,
                status: 0
            }
        ];
    return Order.bulkCreate(
        orders,{
            updateOnDuplicate: ["key"],
            returning: true
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        return  error;
    });
}

module.exports = {
    Order,
    getOrders,
    getOrderByKey,
    createOrder,
    bulkCreateOrders,
    updateOrderStatusbyId,
    stageOrderSyncPayload,
    createMockOrders
}
