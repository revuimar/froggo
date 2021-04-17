var express = require('express');
const auth = require('../auth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/connect',auth.authenticateToken, function(req, res, next) {
  res.status(200).json(`{message: 'Hello world'}`);
});

router.post('/api/gettoken',(req, res) => {
  const token = auth.generateAccessToken({ username: req.body.username });
  console.log(req.body.username)
  res.json(token);
});

module.exports = router;
