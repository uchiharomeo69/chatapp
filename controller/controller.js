const message = require("../model/message");
const users = require("../model/listUser");

exports.loginCon = (io, socket, name) => {
  if (!users.checkName(name)) {
    socket.emit("server_loginfail", "This name has been existed");
  } else {
    users.joinRoom(socket.id, name, "WorldRoom");
    socket.join("WorldRoom");
    socket.emit("server_loginsuccess1");
    io.to("WorldRoom").emit("server_loginsuccessall", {
      listuser: users.getRoom("WorldRoom"),
    });
  }
};

exports.joinRoomCon = (io, socket, room) => {
  let user = users.getById(socket.id);
  let oldroom = user.room;
  socket.leave(oldroom);
  users.joinRoom(user.id, user.name, room);
  socket.join(room);
  socket.emit("server_joinroom1", room);
  io.to(room).emit("server_joinroomall", {
    listuser: users.getRoom(room),
  });
  io.to(oldroom).emit("server_leaveroom", {
    listuser: users.getRoom(oldroom),
    chatting: users.getListChatting(oldroom).length,
  });
};

exports.disconnect = (io, socket) => {
  let user = users.getById(socket.id);
  if (user != undefined) {
    let oldroom = user.room;
    users.leaveRoom(socket.id);
    io.to(oldroom).emit("server_disconnect", {
      listuser: users.getRoom(oldroom),
      chatting: users.getListChatting(oldroom).length,
    });
  }
};

exports.sendtext = (io, socket, mess) => {
  let user = users.getById(socket.id);
  if (user != undefined) {
    let mess1 = message.formatMessage(user.name, mess);
    io.to(user.room).emit("server_sendtext", mess1);
  }
};

exports.focusin = (io, socket) => {
  let user = users.getById(socket.id);
  if (user != undefined) {
    // console.log(user.room);
    user.ischatting = true;
    socket.broadcast
      .to(user.room)
      .emit("server_someonechatting", users.getListChatting(user.room).length);
  }
};

exports.focusout = (io, socket) => {
  let user = users.getById(socket.id);
  if (user != undefined) {
    user.ischatting = false;
    socket.broadcast
      .to(user.room)
      .emit("server_someonechatting", users.getListChatting(user.room).length);
  }
};
