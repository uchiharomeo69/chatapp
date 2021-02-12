let listUser = [];
// join
module.exports.joinRoom = (id, name, room) => {
  let ischatting = false;
  let index = listUser.findIndex((data) => data.name == name.trim());
  if (index == -1) {
    return listUser.push({ id, name, room, ischatting });
  } else {
    listUser[index].room = room;
    listUser[index].ischatting = false;
  }
};
exports.getListChatting = (room) => {
  return listUser.filter((data) => {
    return data.room == room && data.ischatting == true;
  });
};

exports.getById = (id) => {
  return listUser.find((data) => {
    return data.id == id;
  });
};

exports.leaveRoom = (id) => {
  let index = listUser.findIndex((data) => data.id == id);
  return listUser.splice(index, 1);
};

exports.getRoom = (room) => {
  return listUser.filter((data) => data.room == room);
};

exports.checkName = (name) => {
  let index = listUser.findIndex((data) => data.name == name);
  if (index == -1) return true;
  return false;
};
