const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const url = "https://script.google.com/macros/s/AKfycbwZJvKdl2Wvt96MXqgNFRTWkglWP3Bmaa_M95ab4oijrI8hI6nEITJ3IhqfCpU-EYfL/exec";

var Idsocket;

app.use(express.static("client"));
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.set("view engine", "ejs"); // Use EJS
app.set("views", __dirname + "/client"); // Ensure correct views folder

// Store users (username -> socket ID)
let users = {};

io.on("connection", (socket) => {
    Idsocket = socket.id;
    console.log(Idsocket);
    socket.join("room1");
    io.to("room").emit("chatMessage", { text: "hi", id: "server" });
    socket.on("chatMessage", (data) => {
        console.log("Received message:", data);
        io.to("room1").emit("chatMessage", data);
    });
    socket.on("register", async ({ username, email, password }) => {
        if (users[username]) {
            socket.emit("registerResponse", { success: false, message: "Username already taken." });
            return;
        }

        users[username] = socket.id;

        try {
            await writeData(username, email, password, Idsocket);
            socket.emit("registerResponse", { success: true });
        } catch (error) {
            console.error("Error writing data:", error);
            socket.emit("registerResponse", { success: false, message: "Signup failed. Try again." });
        }
    });
});

app.get("/", (req, res) => res.render("index",{isLoggedIn:false})); // Render EJS properly
app.get("/login", (req, res) => res.render("login")); 
app.get("/signup", (req, res) => res.render("signup")); 


// Signup Route
app.post("/signup", async (req, res) => {
    const data = req.body;
    console.log("Received signup data:", data);

    try {
        const socketId = users[data.username] || null; // Get the socket ID if already connected
        await writeData(data.username, data.email, data.password, Idsocket);
        res.redirect("/");
    } catch (error) {
        console.error("Error writing data:", error);
        res.status(500).send("Something went wrong, please try again later.");
    }
});

// Function to send data to Google Apps Script
async function writeData(username, email, password, socketId) {
    var data = { name: username, email: email, password: password, socketId: socketId };
    console.log("Sending data:", data);

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log(result);
}


server.listen(3000, () => console.log("Server running on http://localhost:3000"));
