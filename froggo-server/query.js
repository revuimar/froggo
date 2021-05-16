const dotenv = require('dotenv');
const { Sequelize,DataTypes,Op,Model } = require('sequelize');

dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME.toString(),
    process.env.DB_USER_NAME.toString(),
    process.env.DB_PASS.toString(), {
    dialect: 'postgres',
    host: process.env.DB_HOST.toString()
});

class User extends Model {}
class Branch extends Model {}
class Delivery extends Model {}
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

Branch.init({
    branch_id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true //SERIALiser for postgres
    },
    branch_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    last_sync:{
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'branch' // We need to choose the model name
});

Delivery.init({
    delivery_id:{
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
    last_update: {
        type: DataTypes.DATE,
        allowNull: true
    },

}, {
    sequelize,
    modelName: 'delivery'
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
    },
    last_update:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'supplies' // We need to choose the model name
});


User.hasOne(Branch, { foreignKey: 'user_id' });
Branch.belongsTo(User, { foreignKey: 'user_id' });

Branch.hasOne(Supplies,{ foreignKey: 'branch_id' })
Supplies.belongsTo(Branch, { foreignKey: 'branch_id' });

Branch.hasOne(Delivery,{ foreignKey: 'branch_id' })
Delivery.belongsTo(Branch, { foreignKey: 'branch_id' });

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

async function getBranches (page, items) {
    return Branch.findAll({
        order: [['branch_id','ASC']]
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

async function getDeliveries (page, items) {
    return Delivery.findAll({
            order: [['delivery_id','ASC']]
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
        order: [['delivery_id','DESC']],
            //offset: (page-1) * items,
            //limit: page * items
        where: {
            branch_id: {[Op.eq]: branch_id}
        }
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
};

async function getBranchById (id){
    return Branch.findAll({
        where: {
            branch_id: {[Op.eq]: id}
        }
    }
    ).then((result)=>{
        return result;
    },(error)=> {
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

async function createDelivery(key, list){
    return Delivery.create(
        {key: key, list: list,status: 0, last_update: sequelize.fn('NOW')}
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function syncDelivery(orders){
    return Delivery.bulkCreate(orders,
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

async function createSupply(item_name, quantity,branch_id){
    return Supplies.create(
        {
            item_name: item_name,
            quantity: quantity,
            last_update: sequelize.fn('NOW'),
            branch_id: branch_id
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createSupplies(supplies){
    return Supplies.bulkCreate(
        supplies
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error;
    });
}

async function createBranch(branch_name, password) {
    const t = await sequelize.transaction();
    try {
        const user = await User.create(
            {username: branch_name, password: password},
            {transaction: t}
        ).then(
            async (userResponse) => {
                console.log(userResponse.username, ' User added');
                await Branch.create(
                    {
                        branch_name: branch_name,
                        user_id: userResponse.user_id
                    },
                    {transaction: t})
            },
            (error) => {
                throw error;
            }
        );
        return t.commit().then(
                ()=>{return true},
                (error)=>{throw error}
            );
    }
    catch (e) {
        return t.rollback().then(()=>{
            return false;
        });
    }
}

module.exports = {
    createTables,
    getBranches,
    getDeliveries,
    getSupplies,
    syncDelivery,
    getMyDeliveries,
    getBranchById,
    verifyUser,
    createBranch,
    createUser,
    createDelivery,
    createSupply,
    createSupplies
}
