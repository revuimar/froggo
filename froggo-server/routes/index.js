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

router.post('/api/login', async (req, res) => {
    const token = await auth.generateAccessToken(
        {
            username: req.body.username,
            password: req.body.password
        });
    if (!token) res.sendStatus(401);
    else res.json(token);
});
/*

        REMEMBER TO SETUP AUTHENTICATION!!!
        auth.authenticateToken

 */
router.get('/api/branches/:page/:items', async (request, response) => {
    const page = parseInt(request.params.page);
    const items = parseInt(request.params.items);
    console.log(request.params.page,request.params.items);
    await db.getBranches(page,items).then(
        (result) => {
            console.log(`success ${result}`)
            response.status(200).json(result)
        },
        () => {
            response.sendStatus(401)
        }
    );
});

router.get('/api/branch/:id'/*,auth.authenticateToken*/, async (request, response) => {
    const id = parseInt(request.params.id);
    await db.getBranchById(id).then(
        (result) => {
            response.status(200).json(result)
        },()=>{
            response.sendStatus(401)
        });
});

router.get('/api/checkuser/:username/:password', async (request, response) => {
    const username = request.params.username.toString();
    const password = request.params.password.toString();
    await db.verifyUser(username,password).then(
        (result) => {
            if(result.length === 0){response.sendStatus(401)}
            else {response.status(200).json(result)}
        },()=>{
            response.sendStatus(401)
        });
    }
);
router.post('/api/branches', async (request, response) => {
    const { branch_name, password } = request.body;
    await db.createBranch(branch_name, password).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});
router.post('/api/users', async (request, response) => {
    const { username, password } = request.body;
    await db.createUser(username, password).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});
router.post('/api/supplies', async (request, response) => {
    const { item_name,quantity,branch_id } = request.body;
    await db.createSupply(item_name,quantity,branch_id).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});
router.post('/api/delivery', async (request, response) => {
    const { key,list } = request.body;
    await db.createDelivery(key,list).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;
