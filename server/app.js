import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 5001;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Socket server is running!");
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Handle room joining
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    socket.to(room).emit("welcome", `Welcome to the room: ${room}`);
  });

  // Handle sending messages
  socket.on("message", ({ room, message }) => {
    console.log(`Message in room ${room}: ${message}`);
    socket.to(room).emit("receive-message", `${socket.id}: ${message}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
