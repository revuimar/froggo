var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/connect',auth.authenticateToken, function(req, res, next) {
  res.status(200).json(`{message: 'Hello world'}`);
});

router.post('/api/gettoken', async (req, res) => {
    const token = await auth.generateAccessToken(
        {
            username: req.body.username,
            password: req.body.password
        });
    console.log(req.body.username)
    if (!token) res.sendStatus(401)
    else (res.json(token))
});

module.exports = router;
