let myname = "";
// display is chatting
function displayIschatting(chatting) {
  var d = document.getElementById("chatting");
  d.parentNode.appendChild(d);
  if (chatting > 0) {
    d.style.visibility = "visible";
  } else {
    d.style.visibility = "hidden";
  }
}
displayIschatting(0);

// create socket
const socket = io("https://huynehihi.herokuapp.com/");
//login
function login() {
  let username = document.getElementById("username").value.trim();
  if (username == "") {
    document.getElementById("error").innerHTML = "Can not empty";
    document.getElementById("username").focus();
  } else {
    socket.emit("client_login", username);
    myname = username;
  }
}
//login fail
socket.on("server_loginfail", (data) => {
  myname = "";
  document.getElementById("error").innerHTML = data;
});
// login success
//thong bao thanh cong
socket.on("server_loginsuccess1", () => {
  document.getElementById("login").innerHTML =
    "<h3> Hello " +
    myname +
    "</h3>" +
    "<h3> Enter Room Name: </h3> " +
    "<input type='text' style='margin-right:1rem' id='roomname'>" +
    "<button onclick='joinroom()'> Create/Join </button>";
  document.getElementById("room").innerHTML =
    "<h3> You are in " + "World Room" + "</h3>";
});
// cap nhat danh sach
socket.on("server_loginsuccessall", (data) => {
  updateListUser(data.listuser);
});
// join room
function joinroom() {
  let roomname = document.getElementById("roomname");
  if (roomname.value.trim() == "") {
    document.getElementById("error").innerHTML = "Room name can not empty";
  } else {
    socket.emit("client_joinroom", roomname.value.trim());
  }
}
// send join room to sender
socket.on("server_joinroom1", (room) => {
  document.getElementById("room").innerHTML =
    "<h3> You are in " + room + "</h3>";
  document.getElementById("listchat").innerHTML = "";
});
// send join room to room
socket.on("server_joinroomall", (data) => {
  updateListUser(data.listuser);
});
//send leave room
socket.on("server_leaveroom", (data) => {
  updateListUser(data.listuser);
  displayIschatting(data.chatting);
});
// disconnect
socket.on("server_disconnect", (data) => {
  updateListUser(data.listuser);
  displayIschatting(data.chatting);
});
// send mess
function send() {
  let text = document.getElementById("textsend").value;
  socket.emit("client_sendtext", text);
  document.getElementById("textsend").value = "";
  document.getElementById("textsend").focus();
}
socket.on("server_sendtext", (text) => {
  updateListChat(text);
});
// send chatting

document.getElementById("textsend").addEventListener("keyup", (e) => {
  if (myname == "") {
    alert("You must login");
    document.getElementById("textsend").value = "";
    return;
  }
});
let timeout;
let check = false; // check xem da gui typing chua
document.getElementById("textsend").addEventListener("keypress", (e) => {
  if (myname == "") {
    return;
  }
  if (e.keyCode != 13) {
    if (check == false) {
      socket.emit("client_focusin");
      check = true;
    }
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 3000);
  } else {
    clearTimeout(timeout);
    typingTimeout();
    //sendMessage() function will be called once the user hits enter
    send();
  }
});

function typingTimeout() {
  check = false;
  console.log("out");
  socket.emit("client_focusout");
}

socket.on("server_someonechatting", (chatting) => {
  displayIschatting(chatting);
});

// update
//update list chat

function updateListChat(message) {
  console.log(message);
  if (message.username == myname) {
    let textbox = document.getElementById("listchat");
    textbox.innerHTML +=
      "<li class='canphai'>" +
      "<pre>" +
      "<b>" +
      myname +
      "</b>" +
      "<span class='time1'>" +
      message.time +
      " </span>" +
      ": " +
      message.text +
      "</pre>" +
      "</li>";
  } else {
    let textbox = document.getElementById("listchat");
    textbox.innerHTML +=
      "<li>" +
      "<pre>" +
      "<b>" +
      message.username +
      "</b>" +
      "<span class='time'>" +
      message.time +
      "</span>" +
      ": " +
      message.text +
      "</pre>" +
      "</li>";
  }
}

//update list user

function updateListUser(listUser) {
  let text = "";
  for (let user of listUser) {
    if (user.name != myname) text += "<li>" + user.name + "</li>";
    else {
      text += "<li class='xam'>" + user.name + "</li>";
    }
  }
  document.getElementById("listuser").innerHTML = text;
}
