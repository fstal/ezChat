const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http"); //express acutally uses http under the hood, but we need to access it directly anyway for socket.io
const formatMessage = require("./utils/messages");

const PORT = process.env.PORT || 4000;

// App & server setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  //console.log("new websocket connection");

  const botName = "ezChat Server";

  // Welcome current user
  socket.emit("message", formatMessage(botName, "Welcome to ezChat!"));

  // Broadcast user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has connected")
  ); //broadcast emits to everyone except the one sending it

  // Broadcast user disconnecting
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has disconnected"));
  });

  // Listen to chatmMessage
  socket.on("chatMessage", (msg) =>
    io.emit("message", formatMessage("username", msg))
  );
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
