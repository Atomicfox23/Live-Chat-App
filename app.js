const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chatMessage", (msg) => {
        io.emit("chatMessage", { text: msg.text, id: socket.id }); // Send message + sender ID
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});


server.listen(3000, () => console.log("Server running on http://localhost:3000"));
