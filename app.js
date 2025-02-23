const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); // Initialize socket.io
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html"); // Serve the HTML file
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', { from: 'Server', text: 'Welcome!', createdAt: Date.now() });

    socket.on('createMessage', (message) => {
        console.log('New message:', message);
        io.emit('newMessage', message); // Send to everyone
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
