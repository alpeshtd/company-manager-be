let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: ["http://localhost:3000",'https://company-manager-64bf8.web.app'],
      },
    });
    return io;
  },
  getIo: () => {
    if(!io) {
        throw new Error('Socket.io not initializaed');
    }
    return io;
  }
};
