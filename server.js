const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http"); //express acutally uses http under the hood, but we need to access it directly anyway for socket.io
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const PORT = process.env.PORT || 4000;
const botName = "ezChat Server";

// App & server setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  const allRooms = ["room1", "room2"];

  // On joinRoom
  socket.on("joinRoom", ({ username, room }) => {
    // Leave all rooms if user is in any room
    const user = userLeave(socket.id); // User list
    if (user) {
      allRooms.forEach((r) => socket.leave(r)); // Actual socket room leaving
      announceLeavingUser(user);
    }

    // Add to user list and join
    userJoin({ id: socket.id, username, room });
    socket.join(room);

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, `Welcome to ezChat (${room})!`)
    );

    // Broadcast user connects
    socket.broadcast
      .to(room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the room!`)
      ); //broadcast emits to everyone except the one sending it

    // Send user and room info
    //io.to(room).emit("roomUsers", {
    io.emit("roomUsers", {
      room,
      users: getRoomUsers(room),
    });
  });

  // Listen to chatmMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Broadcast user disconnecting
  socket.on("disconnect", () => {
    const user = userLeave(socket.id); //if user in user list, remove it
    if (user) {
      announceLeavingUser(user);
      io.to(room).emit("roomUsers", { room, users: getRoomUsers(room) });
    }
  });
});

// Announce leaving user to chat
const announceLeavingUser = (user) =>
  io
    .to(user.room)
    .emit(
      "message",
      formatMessage(botName, `${user.username} has disconnected from the chat`)
    );

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
