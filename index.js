const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

const room = require("./api/room").initalize();

app.use("/api/users", require("./api/users"));
app.use("/api/room", room.router);

server.listen(5000);

io.on("connection", socket => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });

    socket.on("leave-room", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
      room.removeUser(userId);
    });
  });

  socket.on("alert-create-room", () => {
    io.emit("create-room-success");
  })
})
