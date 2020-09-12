const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 4000;

// App setup
const app = express();
const server = http.createServer();
const io = socketio(server);
//const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
