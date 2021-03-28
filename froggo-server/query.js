const Pool = require('pg/lib').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'froggo',
    password: 'postgres',
    port: 5432,
});

async function createTables () {
    try {
        const create_sequencer = {
            text: `CREATE SEQUENCE IF NOT EXISTS public.serial START 1;`
        };
        await pool.query(create_sequencer, (error) => {
            if (error) {
                throw error;
            }
        });
        const create_branches = {
            text: `CREATE TABLE IF NOT EXISTS public.branches(
                        branch_id serial PRIMARY KEY,
                        branch_name text UNIQUE NOT NULL
                    );`
        };
        await pool.query(create_branches, (error) => {
            if (error) {
                throw error;
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
                throw error;
            }
        });
    } catch (e) {
        console.error(e.stack);
    }
}



const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
};

const createUser = (request, response) => {
    const { name, email } = request.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, email } = request.body;

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    )
};

module.exports = {
    createTables,
    getUsers,
    getUserById,
    createUser,
    updateUser
};
