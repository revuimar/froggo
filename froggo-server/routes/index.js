var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../query');
var router = express.Router();


/** @swagger
 *  components:
 *      requestBodies:
 *          CredentialBody:
 *              description: JSON containing ussername and password
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Credentials'
 *      schemas:
 *          Credentials:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      description: The user's name.
 *                  password:
 *                      type: string
 *                      description: The user's password.
 */

/** @swagger
 *  /api/login:
 *       get:
 *          summary: Returns JWT
 *          description: Takes user credentials verifies them and in case of correct data returns JWT
 *          requestBody:
 *              $ref: '#/components/requestBodies/CredentialBody'
 *          consumes:
 *              - application/json
 *          produces:
 *              - application/json
 *          parameters:
 *              - in: body
 *                schema:
 *                    type: object
 *                    properties:
 *                        username:
 *                              type: string
 *                        password:
 *                              type: string
 *                    example:
 *                        username: test
 *                        password: test
 *          responses:
 *              '200':
 *                  description: JWT
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *              '401':
 *                  description: error
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 */
router.post('/api/login', async (req, res) => {
    console.log(req.body)
    const token = await auth.generateAccessToken(
        {
            username: req.body.username,
            password: req.body.password
        });
    if (!token) res.status(401).json({error: 'no such user'});
    else res.json(token);
});

/*

        REMEMBER TO SETUP AUTHENTICATION!!!
        auth.authenticateToken

 */
router.get('/api/branches/:page/:items', async (request, response) => {
    const page = parseInt(request.params.page);
    const items = parseInt(request.params.items);

    await db.getBranches(page,items).then(
        (result) => {
            console.log(`success ${result}`)
            response.status(200).json(result)
        },
        () => {
            response.sendStatus(401)
        }
    );
});

router.get('/api/branch/:id'/*,auth.authenticateToken*/, async (request, response) => {
    const id = parseInt(request.params.id);
    await db.getBranchById(id).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/checkuser/:username/:password', async (request, response) => {
    const username = request.params.username.toString();
    const password = request.params.password.toString();
    await db.verifyUser(username,password).then(
        (result) => {
            if(result.length === 0) {
                response.sendStatus(401);
            }
            else {
                response.status(200).json(result);
            }
        },()=>{
            response.sendStatus(401)
        });
    }
);
router.post('/api/branches', (request, response) => {
    const { branch_name, password } = request.body;
    db.createBranch(branch_name, password).then(
        (result) => {
            console.log(result);
            if(result){ 
                response.status(200).json(result);
            }
            else{
                console.log('somehow ', result)
                response.sendStatus(401) 
            }
        },()=>{
            response.sendStatus(401)
        });

});

router.post('/api/users', async (request, response) => {
    const { username, password } = request.body;
    await db.createUser(username, password).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

router.post('/api/supplies', async (request, response) => {
    const { item_name,quantity,branch_id } = request.body;
    await db.createSupply(item_name,quantity,branch_id).then(
        (result) => {
            if(result){ 
                response.status(200).json(result);
            }
            else{ 
                response.sendStatus(401);
            }
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/supplies', async (request, response) => {
    await db.getSupplies().then(
        (result) => {
            if(result){ 
                response.status(200).json(result);
            }
            else{ 
                response.sendStatus(401);
            }
        },()=>{
            response.sendStatus(401);
        });
});


router.post('/api/bulksupplies', async (request, response) => {
    const supplies= request.body;
    console.log('from requesst:  ',supplies)
    await db.createSupplies(supplies).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});
router.post('/api/delivery', async (request, response) => {
    const { key,list } = request.body;
    await db.createDelivery(key,list).then(
        (result) => {
            if(result){ 
                response.status(200).json(result);
            }
            else{ 
                response.sendStatus(401);
            }
        },()=>{
            response.sendStatus(401)
        });
});

router.post('/api/sync/delivery', async (request, response) => {
    const { orders } = request.body;
    console.log('from api: ', orders)
    await db.syncDelivery(orders).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
