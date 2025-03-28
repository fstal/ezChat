const socket = io();

//socket.on("message", (msg) => console.log(msg));

// Handles for elements
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const leaveRoomBtn = document.getElementById("btnLeaveRoom");
const msgContainer = document.querySelector(".message-container");
const room1Btn = document.getElementById("room1");
const room2Btn = document.getElementById("room2");
const usersList = document.getElementById("userList");
const roomName = document.getElementById("room-name");

//  Add event listeners
//
sendBtn.addEventListener("click", () => {
  socket.emit("chatMessage", msgInput.value);

  // Clear input & focus
  msgInput.value = "";
  msgInput.focus();
});

leaveRoomBtn.addEventListener("click", () =>
  socket.emit("chatMessage", msgInput.value)
);

room1Btn.addEventListener("click", () => {
  // "subscribe to room1 and dc from others"
  const username = nameInput.value;
  if (username) {
    socket.emit("joinRoom", { username, room: "room1" });
  } else {
    console.log("need username");
  }
});

room2Btn.addEventListener("click", () => {
  // "subscribe to room2 and dc from others"
  const username = nameInput.value;
  if (username) {
    socket.emit("joinRoom", { username, room: "room2" });
  } else {
    console.log("need username");
  }
});

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Listen on message from server
socket.on("message", (msg) => {
  outputMsg(msg);

  // Scroll down on recieved message
  msgContainer.scrollTop = msgContainer.scrollHeight;
});

// Output msg to DOM
const outputMsg = ({ username, text, time }) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `            
    <p class="meta">
        <span class="text-name">${username}</span>
        <span class="time">${time}</span>
    </p>
    <p class="text">${text}</p>`;
  msgContainer.appendChild(div);
};

// Add room name to DOM
const outputRoomName = (room) => (roomName.innerHTML = room);

// Add User
const outputUsers = (users) => {
  usersList.innerHTML = `${users
    .map((user) => `<li class="user-list-item"> ${user.username} </li>`)
    .join("")}`;

  //   userList.innerHTML = "";
  //   const li = document.createElement('li');
  //   li.classList.add('user-list-item');

  //   users.forEach(user => userList.appendChild(li))

  //   li.innerHTML = user;

  //   users.forEach((user) =>
  //     userList.appendChild(
  //       (document
  //         .createElement("li")
  //         .classList.add("user-list-item").innerHTML = user)
  //     )
  //   );
};
