const jwt = require('jsonwebtoken');


function generateAccessToken(branchname) {
    console.log(branchname);
    return jwt.sign(branchname, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
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
    //console.log(token);
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET.toString(), (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = {
    generateAccessToken,
    authenticateToken
}
