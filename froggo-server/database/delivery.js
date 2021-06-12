const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize }  = require('./connection');


class Delivery extends Model {}

Delivery.init({
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
    }
}, {
    sequelize,
    modelName: 'delivery'
});

async function getDeliveries(page, items) {
    return Delivery.findAll({
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

async function getMyDeliveries (branch_id) {
    return Delivery.findAll({
            order: [['id','DESC']],
            //offset: (page-1) * items,
            //limit: page * items
            where: {
                id: {[Op.eq]: branch_id}
            }
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error);
        throw error
    });
};

async function createDelivery(key, list){
    return Delivery.create(
        {key: key, list: list,status: 0}
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createBulkDelivery(orders){
    console.log('from db',orders);
    return Delivery.bulkCreate(orders,
        {
            fields:["key", "list", "status"],
            updateOnDuplicate: ["key"],
            returning: true
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error);
        throw error;
    });
}

async function deleteDeliveries(ids){
    await Delivery.destroy({
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
    Delivery,
    getDeliveries,
    getMyDeliveries,
    createDelivery,
    createBulkDelivery,
    deleteDeliveries
}
