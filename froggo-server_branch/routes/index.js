var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../database/query');
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

module.exports = router;
