// could connect db

const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// Get current user
const getCurrentUser = (id) => users.find((user) => user.id === id);

module.exports = {
  userJoin,
  getCurrentUser,
};
