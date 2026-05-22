const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// server frontend files
app.use(express.static("public"));

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // debug
  socket.onAny((event, ...args) => {
      console.log("EVENT:", event, args);
  });

// create game
socket.on("createGame", (role) => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();

    rooms[code] = {
        players: [socket.id],
        roles: {
            [socket.id]: role
        }
    };
    
    socket.join(code);
    socket.emit("gameCreated", code);

    console.log(`Game created: ${code}`);
});

// join game
socket.on("joinGame", (code) => {
    if (!rooms[code]){
        socket.emit("errorMessage", "Game not found");
        return;
    }

    const room = rooms[code];

    const hostId = room.players[0];

    const hostRole = room.roles[hostId];

    const joinerRole = hostRole === "draw" ? "guess" : "draw";

    room.players.push(socket.id);
    room.roles[socket.id] = joinerRole;

    socket.join(code);

    socket.emit("gameJoined", {
        code,
        role: joinerRole
    });

    io.to(code).emit("playerJoined", room.players);
    
    console.log(`User joined game: ${code}`);
});

// drawing (scoped to room)
  socket.on("draw", (data) => {
    socket.to(data.code).emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // (clean this up later)
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});