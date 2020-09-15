// could connect db

const users = [];

// Join user to chat
const userJoin = (user) => {
  //const user = { id, username, room };
  users.push({ ...user });
  return user;
};

// Get current user
const getCurrentUser = (id) => users.find((user) => user.id === id);

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return index !== -1 ? users.splice(index, 1)[0] : false;
};

// Get room users
const getRoomUsers = (room) => users.filter((user) => user.room === room);

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
