const socket = io();
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
var messageAudio = new Audio('./assets/sounds/messageSound.mp3');

sendBtn.addEventListener("click", () => {
    const msg = messageInput.value.trim();
    if (msg) {
        socket.emit("chatMessage", { text: msg, id: socket.id }); // Send message + sender ID
        messageInput.value = "";
    }
});
window.addEventListener("keyup",(e)=>{
    if (e.key ==="Enter") {
        const msg = messageInput.value.trim();
    if (msg) {
        socket.emit("chatMessage", { text: msg, id: socket.id }); // Send message + sender ID
        messageInput.value = "";
    }
    }
})


socket.on("chatMessage", (data) => {
    const li = document.createElement("li");
    li.textContent = data.text;

    // Check if the message was sent by the current user
    if (data.id === socket.id) {
        li.classList.add("my-message");
    } else {
        li.classList.add("other-message");
        messageAudio.play();
    }

    messages.appendChild(li);
});

