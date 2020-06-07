import express from "express";
import http from "http";
import ioClient from "socket.io";

let players = [];

const app = express();
const server = http.Server(app);
const io = ioClient(server);

const PORT = 4000;

io.on("connection", (socket) => {
  console.log("A user connect : " + socket.id);
  players.push(socket.id);
  if (players.length == 1) {
    io.emit("isPlayerA");
  }

  socket.on("dealCards", () => {
    io.emit("dealCards");
  });

  socket.on("cardPlayed", (gameObject, isPlayerA) => {
    io.emit("cardPlayed", gameObject, isPlayerA);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected : " + socket.id);
    players = players.filter((player) => player !== socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server started!");
});
