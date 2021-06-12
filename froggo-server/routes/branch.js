var express = require('express');
const auth = require('../auth');
const db = require('../database/query');
var router = express.Router();


router.get('/api/branches/:page/:items', async (request, response) => {
    const page = parseInt(request.params.page);
    const items = parseInt(request.params.items);

    await db.Branches.getBranches(page,items).then(
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
    await db.Branches.getBranchById(id).then(
        (result) => {
            response.status(200).json(result);
        },()=>{
            response.sendStatus(401);
        });
});


router.post('/api/branches', (request, response) => {
    const { branch_name, password } = request.body;
    db.Branches.createBranch(branch_name, password).then(
        (result) => {
            console.log(result);
            if(result){
                response.status(200).json(result);
            }
            else{
                console.log('somehow ', result)
                response.sendStatus(401)
            }
        },()=>{
            response.sendStatus(401)
        });

});

module.exports = router;
