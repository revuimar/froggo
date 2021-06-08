var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../query');
var router = express.Router();

router.post('/api/login', async (req, res) => {
    const token = await auth.generateAccessToken(
        {
            username: req.body.username,
            password: req.body.password
        });
    if (!token) res.sendStatus(401);
    else res.json(token);
});
/*

        REMEMBER TO SETUP AUTHENTICATION!!!
        auth.authenticateToken

 */

router.get('/api/supplies'/*,auth.authenticateToken*/, async (request, response) => {
    await db.getSupplies().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/orders'/*,auth.authenticateToken*/, async (request, response) => {
    await db.getOrders().then(
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
    const { item_name,quantity } = request.body;
    await db.createSupply(item_name,quantity).then(
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
    const supplies = request.body;
    await db.createSupplies(supplies).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(400) }
        },()=>{
            response.sendStatus(401)
        });
});
router.post('/api/order', async (request, response) => {
    const { key,list } = request.body;
    await db.createOrder(key,list).then(
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

router.post('/api/sync/order', async (request, response) => {
    const { orders } = request.body;
    await db.createOrder(orders).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
