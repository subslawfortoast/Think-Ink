console.log("game.js loaded");

const socket = io();

//get room info
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const role = params.get("role");

console.log("Room:", code);
console.log("Role:", role);

//canvas setup
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

//match css size
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

//draw style
ctx.lineWidth = 5;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

//draw state
let drawing = false;
let lastX = 0;
let lastY = 0;

//draw function
function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

//mouse events
canvas.addEventListener("mousedown", (e) => {
        if (role !== "draw") return;

    drawing = true;

    const rect = canvas.getBoundingClientRect();

    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", (e) => {
    drawing = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing || role !== "draw") return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    //draw locally
    drawLine(lastX, lastY, x, y);

    //send to server
    socket.emit("draw", {
        code,
        x0: lastX,
        y0: lastY,
        x1: x,
        y1: y
    });

    lastX = x;
    lastY = y;
});

//receive draw data
socket.on("draw", (data) => {
    drawLine(data.x0, data.y0, data.x1, data.y1);
});