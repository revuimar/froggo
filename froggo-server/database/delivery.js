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
    },
    lastsync:{
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'delivery'
});

async function getDeliveries() {
    return Delivery.findAll({
            order: [['id','ASC']]
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

async function createDelivery(key, list, branch_id){
    return Delivery.create(
        {key: key, list: list,status: 0,branch_id: branch_id}
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createBulkDelivery(orders){
    return Delivery.bulkCreate(orders,
        {
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


async function createMockDeliveries(){
    const deliveries =
        [
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 33},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 43}
                ],
                lastsync: null,
                status: 0,
                branch_id: 1
            },
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 42},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 42},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 41}
                ],
                lastsync: null,
                status: 0,
                branch_id: 1
            },
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 53},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 34},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 23}
                ],
                lastsync: null,
                status: 0,
                branch_id: 1
            }
        ];
    return Delivery.bulkCreate(
        deliveries,{
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
    Delivery,
    getDeliveries,
    getMyDeliveries,
    createDelivery,
    createBulkDelivery,
    deleteDeliveries,
    createMockDeliveries
}
