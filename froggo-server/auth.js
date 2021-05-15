const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

async function generateAccessToken(credentials){
    const verifycreed = async () => {
        const response = await fetch('http://localhost:3001/branches/'+credentials.username+'/'+credentials.password, {
            method: 'GET',
            headers: {
            }
        });
        const myJson = await response.json(); //extract JSON from the http response
        return (myJson.length == 0)
        // do something with myJson
    }
    console.log(credentials);
    if(await verifycreed()){ return null;}
    else return jwt.sign(credentials, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
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
