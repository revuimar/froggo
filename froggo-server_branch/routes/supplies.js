var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../database/query');
const sync = require('../hq_api/sync');
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

router.post('/api/sync/supplies'/*,auth.authenticateToken*/, async (request, response) => {
    db.Supplies.stageSuppliesSyncPayload().then(
        async (supplies) => {
            if(supplies.length === 0){
                return response.status(200).json({"success": "nothing to stage"})
            }
            const payload = {
                "supplies": supplies,
                "branch": {"branch_name": "Piotrkowska"}
            };
            console.log(payload);
            sync.sendSync(payload).then(
                (res) => {
                    return db.Supplies.updateSupplyLastSync(payload.supplies).then(
                        (res) => {
                            response.status(200).json(res)
                        });
                },
                () => {
                    response.sendStatus(401);
                }
            );
        },()=>{
            response.sendStatus(401);
        })
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
