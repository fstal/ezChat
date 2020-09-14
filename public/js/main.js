const e = require("express");

const socket = io();

socket.on("message", (msg) => console.log(msg));

const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const msgContainer = document.querySelector(".message-container");

sendBtn.addEventListener("click", () =>
  socket.emit("chatMessage", msgInput.value)
);

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
const outputMsg = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `            
    <p class="meta">
        <span class="text-name">${nameInput.value || "ezChat Server"}</span>
        <span class="time">${getTime()}</span>
    </p>
    <p class="text">${msg}</p>`;
  msgContainer.appendChild(div);
};

// Get and format current time
const getTime = () => new Date().toLocaleString();
