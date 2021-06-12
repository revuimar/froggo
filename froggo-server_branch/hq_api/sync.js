const fetch = require("node-fetch");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function sendSync(payload){
    console.log("Fetching request!")
    return fetch('https://localhost:3001/api/supplies/sync', {
        method: 'post',
        body:    JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
    })
        //.then(json => console.log(json));
}

module.exports = {
    sendSync
}
