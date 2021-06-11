var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../database/query');
var router = express.Router();

router.get('/api/supplies'/*,auth.authenticateToken*/, async (request, response) => {
    db.Supplies.getSupplies().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/supplies'/*,auth.authenticateToken*/, async (request, response) => {
    db.Supplies.getSupplies().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.get('/api/supplies/:item_name'/*,auth.authenticateToken*/, async (request, response) => {
    const item_name = request.params.item_name.toString();
    db.Supplies.getSuppliesByItemName(item_name).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});

router.post('/api/supplies', async (request, response) => {
    const { item_name,quantity } = request.body;
    db.Supplies.createSupply(item_name,quantity).then(
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

router.post('/api/supply/:id/update/'/*,auth.authenticateToken*/, async (request, response) => {
    const id = parseInt(request.params.id);
    const { quantity } = request.body;
    db.Supplies.updateSupplyQuantity(id,quantity).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

router.get('/api/sync/supplies'/*,auth.authenticateToken*/, async (request, response) => {
    db.Supplies.stageSuppliesSyncPayload().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
    // todo add other steps
});


router.post('/api/bulksupplies', async (request, response) => {
    const supplies = request.body;
    db.Supplies.createSupplies(supplies).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(400) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
