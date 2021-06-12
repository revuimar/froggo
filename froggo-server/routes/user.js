var express = require('express');
const auth = require('../auth');
const db = require('../database/query');
var router = express.Router();



router.get('/api/checkuser/:username/:password', async (request, response) => {
        const username = request.params.username.toString();
        const password = request.params.password.toString();
        await db.Users.verifyUser(username,password).then(
            (result) => {
                if(result.length === 0) {
                    response.sendStatus(401);
                }
                else {
                    response.status(200).json(result);
                }
            },()=>{
                response.sendStatus(401)
            });
    }
);


router.post('/api/users', async (request, response) => {
    const { username, password } = request.body;
    await db.Users.createUser(username, password).then(
        (result) => {
            if(result){ response.status(200).json(result)}
            else{ response.sendStatus(401) }
        },()=>{
            response.sendStatus(401)
        });
});

module.exports = router;

