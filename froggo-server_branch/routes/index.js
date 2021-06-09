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
    if (!token) res.status(401).json({error: 'no such user'});
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

router.get('/api/users'/*,auth.authenticateToken*/, async (request, response) => {
    db.getUsers().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/users/:username'/*,auth.authenticateToken*/, async (request, response) => {
    const username = request.params.username.toString();
    db.getUserByUserName(username).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.post('/api/users', async (request, response) => {
    const { username, password } = request.body;
    db.createUser(username, password).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

router.get('/api/supplies'/*,auth.authenticateToken*/, async (request, response) => {
    db.getSupplies().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/supplies/:item_name'/*,auth.authenticateToken*/, async (request, response) => {
    const item_name = request.params.item_name.toString();
    db.getSuppliesByItemName(item_name).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.post('/api/supplies', async (request, response) => {
    const { item_name,quantity } = request.body;
    db.createSupply(item_name,quantity).then(
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
    db.createSupplies(supplies).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(400) }
        },()=>{
            response.sendStatus(401)
        });
});

router.get('/api/orders'/*,auth.authenticateToken*/, async (request, response) => {
    db.getOrders().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/order/:key'/*,auth.authenticateToken*/, async (request, response) => {
    const key = request.params.key.toString();
    db.getOrderByKey(key).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.post('/api/order', async (request, response) => {
    const { key,list } = request.body;
    db.createOrder(key,list).then(
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

router.post('/api/bulkorder', async (request, response) => {
    const { orders } = request.body;
    db.bulkCreateOrders(orders).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
