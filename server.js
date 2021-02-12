const express = require("express");
const app = express();
const server = require("http").createServer(app);

const con = require("./controller/controller");
server.listen(8080, () => {
  console.log("thanh cong");
});
//create socket io
const io = require("socket.io")(server);
// set view engine
app.set("view engine", "pug");
app.set("views", "views");
// set static location
app.use(express.static("public"));
// render
app.get("/", (req, res) => {
  res.render("login");
});
// server connection
io.on("connection", (socket) => {
  //console.log(socket.id);
  // login
  socket.on("client_login", (name) => {
    con.loginCon(io, socket, name);
  });
  // join room
  socket.on("client_joinroom", (roomname) => {
    con.joinRoomCon(io, socket, roomname);
  });
  // send text
  socket.on("client_sendtext", (text) => {
    con.sendtext(io, socket, text);
  });
  socket.on("client_focusin", () => {
    con.focusin(io, socket);
  });
  socket.on("client_focusout", () => {
    con.focusout(io, socket);
  });
  //disconnect
  socket.on("disconnect", () => {
    con.disconnect(io, socket);
  });
});
