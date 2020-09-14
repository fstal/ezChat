const path = require("path");
const express = require("express");
const socket = require("socket.io");
const http = require("http"); //express acutally uses http under the hood, but we need to access it directly anyway for socket.io

const PORT = process.env.PORT || 4000;

// App setup
const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  console.log("new websocket connection", socket);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
