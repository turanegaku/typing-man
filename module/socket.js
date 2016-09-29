const path = require('path');

let io;

exports.post = (room, record) => {
    io.to(room).emit('record:new', record);
};

exports.io = (server) => {
    console.log('create io server');
    io = require('socket.io')(server);
    io.on('connect', (socket) => {
        socket.join(path.basename(socket.handshake.headers.referer));
    });
};
