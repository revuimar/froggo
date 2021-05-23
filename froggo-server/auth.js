const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const db = require('./query');


async function generateAccessToken(credentials){
    return await db.verifyUser(credentials.username,credentials.password).then(
        (result) => {
            if(result.length !== 0){
                return jwt.sign(credentials, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
            }
            else return null;
        }
    )
}

/*
    To pass token to request middleware function add token to the request header
    in a form of:
        Authorization: Bearer JWT_ACCESS_TOKEN
    Example of curl request:
        curl -i -X GET
            -H "Authorization: Bearer JWT_ACCESS_TOKEN"
            http://localhost:3000/connect
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(authHeader);
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET.toString(), (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        console.log(user);
        next();
    })
}

module.exports = {
    generateAccessToken,
    authenticateToken
}
