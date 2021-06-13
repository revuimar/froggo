const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize } = require('./connection');

class User extends Model {}

User.init({
    id:{
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

module.exports = {
    User,
    getUsers,
    getUserByUserName,
    verifyUser,
    createUser,
    createMockUsers
}
