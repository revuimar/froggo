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

/*
const pool = new Pool({
    user: process.env.DB_USER_NAME.toString(),
    host: process.env.DB_HOST.toString(),
    database: process.env.DB_NAME.toString(),
    password: process.env.DB_PASS.toString(),
    port: process.env.DB_PORT.toString()
});

async function createTables () {
    try {
        const create_sequencer = {
            text: `CREATE SEQUENCE IF NOT EXISTS public.serial START 1;`
        };
        await pool.query(create_sequencer, (error) => {
            if (error) {
                throw error
            }
        });
        const create_branches = {
            text: `CREATE TABLE IF NOT EXISTS public.branches(
                        branch_id serial PRIMARY KEY,
                        branch_name text UNIQUE NOT NULL,
                        password text
                    );`
        };
        await pool.query(create_branches, (error) => {
            if (error) {
                throw error
            }
        });
        const create_products = {
            text: `CREATE TABLE IF NOT EXISTS public.products(
                        product_id serial PRIMARY KEY,
                        branch_id bigint,
                        product_name text NOT NULL,
                        product_stock integer NOT NULL,
                        FOREIGN KEY (branch_id) REFERENCES public.branches (branch_id)
                    );`
        };
        await pool.query(create_products, (error) => {
            if (error) {
                throw error
            }
        });
    } catch (e) {
        console.error(e.stack);
    }
}



const getBranches = async (request, response) => {
    pool.query('SELECT * FROM public.branches ORDER BY branch_id ASC', (error, results) => {
            if (error) {
                throw error
            }
            console.log(results.rows)
            response.status(200).json(results.rows)
    })
}

const getBranchById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM public.branches WHERE branch_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const verifyUser = (request, response) => {
    console.log(request.params.username,)
    const username = request.params.username
    const password = request.params.password
    pool.query('SELECT * FROM public.branches WHERE branch_name = $1 and password = $2', [username,password], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createBranch = (request, response) => {
    const { branch_name, password } = request.body

    pool.query(`INSERT INTO public.branches (branch_id, branch_name,password) VALUES (nextval('public.serial'),$1,$2)`, [branch_name], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results}`)
    })
}

*/

async function getBranches (page, items) {
    return Branch.findAll({
        order: [['branch_id','DESC']]
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


async function createBranch(branch_name, password) {
    const t = await sequelize.transaction();
    try {
        const user = await User.create(
            {username: branch_name, password: password},
            {transaction: t}
        ).then(
            async (userResponce) => {
                console.log(userResponce.username, ' User added');
                await Branch.create(
                    {
                        branch_name: branch_name,
                        user_id: userResponce.user_id
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
    getBranchById,
    verifyUser,
    createBranch,
    createUser
}
