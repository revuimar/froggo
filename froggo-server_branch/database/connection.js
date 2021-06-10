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

module.exports = {
    sequelize
}
