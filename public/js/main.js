const socket = io();

socket.on("message", (msg) => console.log(msg));

// Handles for elements
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const msgContainer = document.querySelector(".message-container");
const room1Btn = document.getElementById("room1");
const room2Btn = document.getElementById("room2");

// Add event listeners
sendBtn.addEventListener("click", () =>
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
  if (username) {
    socket.emit("joinRoom", { username, room: "room2" });
  } else {
    console.log("need username");
  }
});

// Message from server
socket.on("message", (msg) => {
  outputMsg(msg);

  // Scroll down on recieved message
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Clear input & focus
  msgInput.value = "";
  msgInput.focus();
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
