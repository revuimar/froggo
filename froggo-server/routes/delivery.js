var express = require('express');
const auth = require('../auth');
const db = require('../database/query');
var router = express.Router();

router.post('/api/delivery', async (request, response) => {
    const { key,list } = request.body;
    await db.Deliveries.createDelivery(key,list).then(
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
    await db.Deliveries.createBulkDelivery(orders).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
