const { sequelize } = require('./connection');

const Users = require('./user');
const Deliveries = require('./delivery');
const Supplies = require('./supplies');
const Branches = require('./branch');


Branches.Branch.belongsTo(Users.User, { foreignKey: 'user_id' });
Users.User.hasOne(Branches.Branch, { foreignKey: 'user_id' });

Supplies.Supplies.belongsTo(Branches.Branch, { foreignKey: 'branch_id' });
Branches.Branch.hasMany(Supplies.Supplies,{ foreignKey: 'branch_id' });

Deliveries.Delivery.belongsTo(Branches.Branch, { foreignKey: 'branch_id' });
Branches.Branch.hasMany(Deliveries.Delivery,{ foreignKey: 'branch_id' });


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

module.exports = {
    Users,
    Deliveries,
    Supplies,
    Branches,
    createTables
}
