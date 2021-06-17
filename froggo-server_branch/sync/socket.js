const io = require('socket.io-client');

function socketConnection(){
    const socket = io.connect("http://localhost:3001/", {
        reconnection: true,
        secure: true,
        rejectUnauthorized: false
    });
    socket.on('connect', function () {
        console.log('connected to localhost:3001');
        socket.on('clientEvent', function (data) {
            console.log('message from the server:', data);
            socket.emit('serverEvent', "thanks server! for sending '" + data + "'");
        });
        /*socket.on('requestSyncSupplies',function (_,callback) {
            console.log('Begin payload transfer:', payload);
            socket.emit('syncSupplies',payload);
        })*/
        socket.on('syncSuppliesConfirmation',function (payload) {
            console.log('Server confirmed Supply sync', payload);
        })
    });
    return socket;
}
module.exports = { socketConnection };
