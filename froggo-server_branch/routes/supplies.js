var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../database/query');
const sync = require('../sync/sync');
const {socketConnection} = require('../sync/socket');
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
         (supplies) => {
            if(supplies.length === 0){
                return response.status(200).json({"success": "nothing to stage"})
            }
            const payload = {
                "supplies": supplies,
                "branch": {"branch_name": "Piotrkowska"}
            };
            console.log(payload);
            const socket = socketConnection();
            socket.emit('syncSupplies',payload,(callback)=>{
                if(callback.success){
                    return db.Supplies.updateSupplyLastSync(payload.supplies).then(
                        (res) => {
                            socket.disconnect();
                            response.status(200).json(res)
                        });
                }else{
                    socket.disconnect();
                    response.sendStatus(401);
                }
            });
        },()=>{
            socket.disconnect();
            response.sendStatus(401);
        })
});

router.post('/api/requestsync/supplies'/*,auth.authenticateToken*/, (request, response)=>{
    const branch = {"branch_name": "Piotrkowska"};
    const socket = socketConnection();
    /*if(socket.disconnected){
        return response.sendStatus(401);
    }*/
    socket.emit('requestSyncSupplies',branch,(callback1) => {
        console.log("callback content ",callback1);
        if(callback1.success){
            const supplies = callback1.supplies

            if(supplies.length === 0){
                console.log(supplies,{success: "Supplies up to date"});
                socket.disconnect();
                return response.status(200).json({success: "Supplies up to date"});
            }
            else {
                socket.emit('confirmSync', supplies,branch, (callback2) => {
                    if (callback2.success) {
                        db.Supplies.updateSupplies(supplies).then((res) => {
                                socket.disconnect();
                                response.status(200).json(res);
                            },
                            () => {
                                socket.disconnect();
                                return response.sendStatus(401);
                            }
                        )
                    } else {
                        socket.disconnect();
                        return response.sendStatus(401);
                    }
                })
            }
        }
        else {
            console.log("fail");
            socket.disconnect();
            return response.sendStatus(401);
        }
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
