const dotenv = require('dotenv');
const { Sequelize,DataTypes,Op,Model } = require('sequelize');

dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME.toString(),
    process.env.DB_USER_NAME.toString(),
    process.env.DB_PASS.toString(), {
    dialect: 'postgres',
    host: process.env.DB_HOST.toString(),
    logging: false
});

class User extends Model {}
class Order extends Model {}
class Supplies extends Model {}

User.init({
    user_id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true //SERIALiser for postgres
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
        // allowNull defaults to true
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'user' // We need to choose the model name
});

Order.init({
    order_id:{
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
    modelName: 'order'
});

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
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'supplies' // We need to choose the model name
});

async function createTables () {
    // create tables if not exists
    return await sequelize.sync().then(
        (res)=>{
            return res;
        },
        async (res)=>{
            await sequelize.close();
            return res;
        });
    // do we close connection?
}

async function getOrders (page, items) {
    return Order.findAll({
            order: [['order_id','ASC']]
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

async function getSupplies (page, items) {
    return Supplies.findAll({
            order: [['item_id','ASC']]
            //offset: (page-1) * items,
            //limit: page * items
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        console.log(error);
        throw error
    });
}

async function verifyUser(username, password){
    return User.findAll({
            where: {
                [Op.and]: [
                    { username: username },
                    { password: password }
                    ]}
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createUser(username, password){
    return User.create(
        {username: username, password: password}
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createOrder(key, list){
    return Order.create(
        {key: key, list: list,status: 0, last_update: sequelize.fn('NOW')}
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function syncOrder(orders){
    return Order.bulkCreate(orders,
        {
            fields:["key", "list", "status"] ,
            updateOnDuplicate: ["key"]
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
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
        throw error;
    });
}

async function createSupplies(supplies){
    return Supplies.bulkCreate(
        supplies,{returning: true}
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}


module.exports = {
    createTables,
    getOrders,
    getSupplies,
    verifyUser,
    createUser,
    createOrder,
    createSupply,
    createSupplies
}
