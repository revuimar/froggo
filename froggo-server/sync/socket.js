const db = require('../database/query')
let io;
exports.socketConnection = (server) => {
    console.log('Web Socket is setup!');
    io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.info(`Client ${socket.id} connected`);
        socket.join(socket.request._query.id);
        socket.on('serverEvent', function (data) {
            console.log('new message from client:', data);
            socket.emit('clientEvent',{message: "hello client!"})
        });
        socket.on('syncSupplies', function (payload,callback){
            const {supplies,branch} = payload;
            db.Supplies.syncSupplies(supplies,branch).then(
                (result) => {
                    if(result){
                        callback({success: true})
                    }
                    else {
                        callback({success: false})
                    }
                },()=>{
                    callback({success: false})
                });
        });
        socket.on('requestSyncSupplies',function (branch,callback){
            console.log('hello ', branch,branch.branch_name);
            const branch_name = branch.branch_name;
            db.Supplies.stageSuppliesSyncPayload(branch_name).then(
                (supplies)=>{
                console.log('staged supplies: ',supplies);
                callback({success: true,"supplies":supplies});
                //callback({supplies:supplies});
            },()=>{
                callback({success: false});
            })
        })
        socket.on('confirmSync',function (supplies,branch,callback) {
            db.Supplies.updateSupplyLastSync(supplies,branch.branch_name).then((query)=>{
                callback({success: true})
            },()=>{
                callback({success: false})
            })

        })
        socket.on('disconnect', () => {
            console.info(`Client ${socket.id} disconnected`);
        });
        socket.on('hello', () => {
            console.info(`client says hello`);
        });
    });
};

exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);

exports.getRooms = () => io.sockets.adapter.rooms;
