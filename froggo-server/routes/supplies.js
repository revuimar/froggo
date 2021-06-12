var express = require('express');
const auth = require('../auth');
const db = require('../database/query');
var router = express.Router();

router.post('/api/supplies', async (request, response) => {
    const { item_name,quantity,branch_id } = request.body;
    await db.Supplies.createSupply(item_name,quantity,branch_id).then(
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
    await db.Supplies.getSupplies().then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});


router.post('/api/supplies/sync', async (request, response) => {
    const {supplies,branch}= request.body;
    console.log('from request:  ',supplies)
    db.Supplies.syncSupplies(supplies,branch).then(
        (result) => {
            if(result){
                response.status(200).json(result);
            }
            else {
                response.sendStatus(401);
            }
        },()=>{
            response.sendStatus(401);
        });
});

module.exports = router;
