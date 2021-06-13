var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../database/query');
var router = express.Router();
const {socketConnection} = require('../sync/socket');

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
router.get('/api/connectsocket',(req,res)=>{
    const socket = socketConnection()
    socket.emit('serverEvent',{message: "hello"});
    //socket.disconnect();
    res.status(200).json({'success':'socket connected'})
})
router.get('/api/disconnectsocket',(req,res)=>{
    //socket.disconnect();
    res.status(200).json({'success':'socket disconnected'})
})

module.exports = router;
