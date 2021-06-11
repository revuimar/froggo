const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize } = require('./connection');

const Users = require('./users');
const Orders = require('./orders');
const Supplies = require('./supplies');


async function createTables () {
    // create tables if not exists
    return sequelize.sync().then(
        (res)=>{
            return res;
        },
        async (res)=>{
            await sequelize.close();
            return res;
        });
    // do we close connection?
}

module.exports = {
    Orders,
    Users,
    Supplies,
    createTables
}
