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

async function createMockUsers(){
    const users = [
        {"username": "Mariusz", "password": "test"},
        {"username": "Andrzej", "password": "test"},
        {"username": "Antoni", "password": "test"},
        {"username": "Monika", "password": "test"},
        {"username": "Alicja", "password": "test"},
        {"username": "Shaniqua", "password": "test"},
        {"username": "Kwiryniusz", "password": "test"},
        {"username": "Zbyszek", "password": "test"},
        {"username": "Zdzisław", "password": "test"}
    ]
    return User.bulkCreate(users,
        {
            updateOnDuplicate: ["username"]
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        return error;
    });
}

async function createMockSupplies(){
    const supplies = [
        {"item_name": "Harnaś", "quantity": 50},
        {"item_name": "Sok", "quantity": 30},
        {"item_name": "Burak", "quantity": 320},
        {"item_name": "Cebula", "quantity": 780},
        {"item_name": "Kalarepa", "quantity": 322},
        {"item_name": "Papierosy", "quantity": 80},
        {"item_name": "Kalafiory", "quantity": 280},
        {"item_name": "Zapiekanki", "quantity": 30},
        {"item_name": "Grappa Ice", "quantity": 430},
        {"item_name": "Lewandowski album pamiątkowy", "quantity": 30}
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

async function createMockOrders(){
    const orders =
        [
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 4},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 33},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 43}
                ],
                status: 0
            },
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 42},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 42},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 41}
                ],
                status: 0
            },
            {key: Math.random().toString(36).substring(7),
                list: [
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 53},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 34},
                    {"item_name": Math.random().toString(36).substring(7),"quantity": 23}
                ],
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

async function getUsers () {
    return User.findAll(
    ).then((result)=>{
        return result;
    },(error)=> {
        return error
    });
}

async function getUserByUserName (username) {
    return User.findAll({
        where: {
        username: username
    }}
    ).then((result)=>{
        return result;
    },(error)=> {
        return error
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
        throw error;
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
        throw error
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
        throw error;
    });
}


module.exports = {
    createTables,
    createMockUsers,
    createMockSupplies,
    createMockOrders,
    getUserByUserName,
    getUsers,
    verifyUser,
    createUser,
    getOrders,
    getOrderByKey,
    createOrder,
    bulkCreateOrders,
    getSupplies,
    getSuppliesByItemName,
    createSupply,
    createSupplies
}
