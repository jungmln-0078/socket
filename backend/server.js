const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secret = require("./config/secret").secretKey;
const options = require("./config/secret").option;
let users = [];
let socketClients = [];
let rooms = [];

let corsOptions = {
  origin: "http://localhost:8081",
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post("/login", (req, res) => {
  //var decoded = jwt.verify(req.headers["auth-token"], secret);
  if (
    users.find((u) => u.id == req.body.id && u.password == req.body.password)
  ) {
    const payload = {
      id: req.body.id,
      password: req.body.password,
    };

    const result = {
      token: jwt.sign(payload, secret, options),
    };
    res.send(Object.assign(payload, result));
  } else {
    res.send("아이디나 비밀번호가 틀립니다.");
  }
});

app.post("/register", (req, res) => {
  if (
    req.body.id &&
    req.body.password &&
    !users.find((u) => u.id == req.body.id)
  ) {
    const payload = {
      id: req.body.id,
      password: req.body.password,
    };

    const result = {
      token: jwt.sign(payload, secret, options),
    };
    let user = Object.assign(payload, result);
    users.push(user);
    res.send(user);
  } else if (users.find((u) => u.id == req.body.id)) {
    res.send("해당 ID가 이미 있습니다.");
  } else {
    res.sendStatus(400);
  }
});

app.get("/rooms/:id", (req, res) => {
  try {
    let decoded = jwt.verify(req.header("auth-token"), secret);
    let roomIdx = rooms.findIndex((r) => r.id == req.params.id);
    if (roomIdx == -1) {
      res.send("해당 방이 없습니다.");
    } else {
      res.send(rooms[roomIdx]);
    }
  } catch (e) {
    res.send("로그인이 필요합니다.");
  }
});

app.get("/rooms", (req, res) => {
  try {
    let decoded = jwt.verify(req.header("auth-token"), secret);
    res.send(rooms);
  } catch (e) {
    res.send("로그인이 필요합니다.");
  }
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});

let socketServer = io.on("connection", (socket) => {
  socket.on("room_create", (data) => {
    let idx = rooms.length + 1 + data.name;
    let room = {
      name: data.name,
      id: idx,
      maxuser: data.maxuser,
      curuser: 0,
      users: [],
    };
    rooms.push(room);
    socket.join(room.id);
    socket.emit("room_create", room.id);
  });

  socket.on("room_join", (data) => {
    let roomIdx = rooms.findIndex((r) => r.id == data.id);
    if (roomIdx != -1) {
      if (rooms[roomIdx].curuser < rooms[roomIdx].maxuser) {
        rooms[roomIdx].curuser++;
        rooms[roomIdx].users.push(data.userid);
        socket.join(data.id);
        io.to(data.id).emit("system", `${data.userid} 님이 입장하셨습니다.`);
      } else {
        socket.emit("join_reject", "해당 방이 가득 찼습니다.");
      }
    } else {
      socket.emit("join_reject", "해당 방이 존재하지 않습니다.");
    }
  });

  socket.on("room_leave", (data) => {
    let roomIdx = rooms.findIndex((r) => r.id == data.id);
    if (roomIdx != -1) {
      rooms[roomIdx].curuser--;
      let userIdx = rooms[roomIdx].users.findIndex((u) => u.id == data.userid);
      rooms[roomIdx].users.splice(userIdx, 1);
      socket.leave(data.id);
      if (rooms[roomIdx].curuser == 0) {
        rooms.splice(roomIdx, 1);
      }
      io.to(data.id).emit("system", `${data.userid} 님이 퇴장하셨습니다.`);
    }
  });
  
  socket.on("login", (data) => {
    let alreadyLogin = socketClients.find((sc) => sc.id == data.id);
    if (!alreadyLogin) {
      socketClients.push({
        id: data.id,
        socketId: socket.id,
      });
    } else {
      io.to(alreadyLogin.socketId).emit("logout");
      let idx = socketClients.findIndex((sc) => sc.id == data.id);
      socketClients.splice(idx, 1);
      socketClients.push({
        id: data.id,
        socketId: socket.id,
      });
    }
  });

  socket.on("chat", (data) => {
    let returnMsg = {
      talker: data.talker,
      message: data.message,
    };

    io.to(data.room).emit("chat", returnMsg);
  });

  socket.on("disconnect", () => {
    let scIdx = socketClients.findIndex((sc) => sc.socketId == socket.id);
    socketClients.splice(scIdx, 1);
  });
});

server.listen(5000);
