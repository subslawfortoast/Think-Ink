console.log("client.js loaded");

const socket = io();
let currentRoom = null;

socket.on("connect", () => {
    console.log("CLIENT CONNECTED:", socket.id);
});

// ask server to create game (and generate game code)
function createGame(role){
    console.log("createGame clicked");

    socket.emit("createGame", role);

    socket.once("gameCreated", (code) => {
        currentRoom = code;

        alert("Send this code to your friend: " + code);

        window.location.href = "game.html?code=" + code + "&role=" + role;
    });
}

// join game
function joinGame(){
    const input = document.getElementById("gameCode");

    const code = input.value.trim().toUpperCase();

    socket.emit("joinGame", code);

    socket.once("gameJoined", ({code, role}) => {
        window.location.href = "game.html?code=" + code + "&role=" + role;
    });
}