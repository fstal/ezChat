const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http"); //express acutally uses http under the hood, but we need to access it directly anyway for socket.io
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const PORT = process.env.PORT || 4000;

// App & server setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  const botName = "ezChat Server";

  // On joinRoom
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ezChat!"));

    // Broadcast user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the room!`)
      ); //broadcast emits to everyone except the one sending it
  });

  // Listen to chatmMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Broadcast user disconnecting
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has disconnected"));
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
