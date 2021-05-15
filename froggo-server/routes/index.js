var express = require('express');
const auth = require('../auth');
const crypto = require('crypto');
const db = require('../query');
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
/*

        REMEMBER TO SETUP AUTHENTICATION!!!
        auth.authenticateToken

 */
router.get('/api/branches/:page/:items', async (request, responce) => {
    const page = parseInt(request.params.page);
    const items = parseInt(request.params.items);
    console.log(request.params.page,request.params.items);
    await db.getBranches(page,items).then(
        (result) => {
            console.log(`success ${result}`)
            responce.status(200).json(result)
        },
        () => {
            responce.sendStatus(401)
        }
    );
});

router.get('/api/branch/:id'/*,auth.authenticateToken*/, async (request, responce) => {
    const id = parseInt(request.params.id);
    await db.getBranchById(id).then(
        (result) => {
            responce.status(200).json(result)
        },()=>{
            responce.sendStatus(401)
        });
});

router.get('/api/checkuser/:username/:password', async (request, responce) => {
    const username = request.params.username.toString();
    const password = request.params.password.toString();
    await db.verifyUser(username,password).then(
        (result) => {
            if(result.length === 0){responce.sendStatus(401)}
            else {responce.status(200).json(result)}
        },()=>{
            responce.sendStatus(401)
        });
    }
);
router.post('/api/branches', async (request, responce) => {
    const { branch_name, password } = request.body;
    await db.createBranch(branch_name, password).then(
        (result) => {
            if(result){ responce.status(200).json(result)}
            else{ responce.sendStatus(401) }
        },()=>{
            responce.sendStatus(401)
        });
});

module.exports = router;
