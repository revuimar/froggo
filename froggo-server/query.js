const Pool = require('pg/lib').Pool;
const dotenv = require('dotenv');
dotenv.config();

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
                        branch_name text UNIQUE NOT NULL
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

const createBranch = (request, response) => {
    const { branch_name } = request.body

    pool.query(`INSERT INTO public.branches (branch_id, branch_name) VALUES (nextval('public.serial'),$1)`, [branch_name], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results}`)
    })
}


module.exports = {
    createTables,
    getBranches,
    getBranchById,
    createBranch
}
