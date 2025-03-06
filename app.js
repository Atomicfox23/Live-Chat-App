const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const url = "https://script.google.com/macros/s/AKfycbyjF_TBog1W3-wEMDNzNoc49e3NQWGOGrPowwySrgqO7VoeWMD1wkQ52mgIokezZawZ/exec";

app.use(express.static("client"));
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chatMessage", (msg) => {
        io.emit("chatMessage", { text: msg.text, id: socket.id }); // Send message + sender ID
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html"); // Adjust path as needed
});
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/client/login.html"); // Adjust path as needed
});
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/client/signup.html"); // Adjust path as needed
});
// Signup Route to handle POST request
app.post("/signup", async (req, res) => {
    const data = req.body;
   // console.log(data);  // Logs the data sent in the request body
    try {
        await writeData(data.username,data.email,data.password);  // Send data to Google Apps Script
        res.redirect("/");  // Redirect after success
    } catch (error) {
        console.error("Error writing data:", error);
        res.status(500).send("Something went wrong, please try again later.");
    }
});

// Function to fetch data from Google Apps Script (if needed)
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);  // Logs the sheet data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to send data to Google Apps Script
async function writeData(username,email,password) {
    var data = {
        name: username,
        email: email,
        password: password
    };
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log(result);
}
    
 // Should log "Success"

//writeData();

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
