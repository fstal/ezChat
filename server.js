const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http"); //express acutally uses http under the hood, but we need to access it directly anyway for socket.io

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

  // Welcome current user
  socket.emit("message", "Welcome to ezChat");

  // Broadcast user connecting
  socket.broadcast.emit("message", "A user has connected"); //broadcast emits to everyone except the one sending it

  // Broadcast user disconnecting
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  // Listen to chatmMessage
  socket.on("chatMessage", (msg) => io.emit("message", msg));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
