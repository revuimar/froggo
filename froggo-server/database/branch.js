const { Sequelize,DataTypes,Op,Model } = require('sequelize');
const { sequelize }  = require('./connection');
const { User } = require('./user');


class Branch extends Model {}

Branch.init({
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true //SERIALiser for postgres
    },
    branch_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'branch' // We need to choose the model name
});

async function getBranches() {
    return Branch.findAll({
            order: [['id','ASC']]
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
                id: {[Op.eq]: id}
            }
        }
    ).then((result)=>{
        return result;
    },(error)=> {
        throw error
    });
}


async function createBranch(branch_name, password) {
    try {
        var branch = null
        const t = await sequelize.transaction(async (t) => {
            const user = await User.create(
                {username: branch_name, password: password},
                {transaction: t}
            );
            branch = await Branch.create(
                {
                    branch_name: branch_name,
                    user_id: user.id
                },
                {transaction: t});
        });
        console.log('branch: ',branch);
        return branch;
    } catch (error) {
        return null;
    }
}

async function deleteBranch(branch_name){
    const t = await sequelize.transaction();
    try {
        await Branch.destroy({
                where: {
                    branch_name: {[Op.eq]: branch_name}}
            }
            ,{transaction: t}
        ).then(
            async (userResponse) => {
                await User.destroy({
                        where: {
                            username: {[Op.eq]: branch_name}}
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
    catch (error) {
        return t.rollback().then(()=>{
            return false;
        });
    }
}


async function createMockBranches() {
    const users = [
        {"username": "Piotrkowska", "password": "test"},
        {"username": "Struga", "password": "test"},
        {"username": "Narutowicza", "password": "test"},
        {"username": "Jaracza", "password": "test"},
        {"username": "Politechniki", "password": "test"},
        {"username": "W??lcza??ska", "password": "test"},
        {"username": "Skorupki", "password": "test"},
        {"username": "Ko??ciuszki", "password": "test"},
        {"username": "Zielona", "password": "test"}
    ];
    try {
        var dbbranch = []
        const t = await sequelize.transaction(async (t) => {
            const dbusers = await User.bulkCreate(
                users,
                {
                    updateOnDuplicate: ["username","password"],
                    transaction: t,
                    returning: true
                }
            );
            let branches = [];
            for(let i in dbusers){
                 branches.push({"branch_name": dbusers[i].dataValues.username, "user_id": parseInt(dbusers[i].dataValues.id)});
            }
            dbbranch = await Branch.bulkCreate(
                branches,
                {
                    updateOnDuplicate: ["branch_name","user_id"],
                    transaction: t,
                    returning: true
                });
        });
        return dbbranch.length;
    } catch (error) {
        return null;
    }
}


module.exports = {
    Branch,
    getBranches,
    getBranchById,
    createBranch,
    deleteBranch,
    createMockBranches
}
