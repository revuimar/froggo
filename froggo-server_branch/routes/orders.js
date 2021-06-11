var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../database/query');
var router = express.Router();



router.get('/api/orders'/*,auth.authenticateToken*/, async (request, response) => {
    db.Orders.getOrders().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});


router.get('/api/orders'/*,auth.authenticateToken*/, async (request, response) => {
    db.Orders.getOrders().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/order/:key'/*,auth.authenticateToken*/, async (request, response) => {
    const key = request.params.key.toString();
    db.Orders.getOrderByKey(key).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.post('/api/order'/*,auth.authenticateToken*/, async (request, response) => {
    const { key,list } = request.body;
    db.Orders.createOrder(key,list).then(
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

router.post('/api/order/:id/update/'/*,auth.authenticateToken*/, async (request, response) => {
    const id = parseInt(request.params.id);
    const { status } = request.body;
    db.Orders.updateOrderStatusbyId(id,status).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

router.get('/api/sync/orders'/*,auth.authenticateToken*/, async (request, response) => {
    await console.log("hellllo");
    db.Orders.stageOrderSyncPayload().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
    // todo add other steps
});



router.post('/api/bulkorder'/*,auth.authenticateToken*/, async (request, response) => {
    const { orders } = request.body;
    db.Orders.bulkCreateOrders(orders).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
