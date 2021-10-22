let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, { log: false, origins: "*:*" }    );
    return io;
  },
  getIO: () => {
    if (!io) {
      console.log(io);
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
