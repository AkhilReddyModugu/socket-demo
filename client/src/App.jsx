import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:5001", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Chat App
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
          Socket ID: {socketID}
        </Typography>

        {/* Join Room */}
        <Box component="form" onSubmit={joinRoomHandler} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Join Room
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              id="room-name"
              label="Room Name"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </Stack>
        </Box>

        {/* Send Message */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Send Message
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="message"
              label="Message"
              variant="outlined"
            />
            <TextField
              fullWidth
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              id="room"
              label="Room"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Stack>
        </Box>

        {/* Display Messages */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Messages
          </Typography>
          <Paper elevation={1} sx={{ maxHeight: 200, overflow: "auto", p: 2 }}>
            <Stack spacing={1}>
              {messages.map((m, i) => (
                <Typography key={i} variant="body1">
                  {m}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
