const canvas = document.getElementById("main");
const context = canvas.getContext("2d");
let gameMode = 1;
let keys = {w: false, s: false, ArrowUp: false, ArrowDown: false};
context.fillStyle = "white";
window.onload = () => {setInterval(play, 1000/fps);};

const fps = 61;
const p1 = {id: 1, x: 2, y: 0, score: 0, w: 5, h: 30};
const p2 = {id: 2, x: canvas.width-7, y: canvas.height-30, score: 0, w: 5, h: 30, speed: 0.8};
const ball = {x: 150, y: 63, r: 2, speed: 1, velX: 1, velY: 1};
const net = {x: canvas.width/2 - 1, y: 0, w: 1, h: 10};
//rendering functions
function createRec(x, y, w, h){
    context.beginPath();
    context.fillRect(x, y, w, h);
    context.closePath();
}

function createBall(x, y, r){
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.fill();
    context.closePath();
    
}

function createNet(x, y, w, h){
    for(let i = y; i < canvas.clientHeight; i += h + 3)
        createRec(x, i, w, h);
}

function createNumber(text, x, y){
    context.font = "20px Consolas";
    context.fillText(text, x, y);
}

function renderGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    createRec(p1.x, p1.y, p1.w, p1.h);
    createRec(p2.x, p2.y, p2.w, p2.h);
    createBall(ball.x, ball.y, ball.r);
    createNet(net.x, net.y, net.w, net.h);
    createNumber(p1.score, 25, 20);
    createNumber(p2.score, 255, 20);
}


function collision(b, p){
    
    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;
    
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall(){
    ball.x = 150;
    ball.y = 63;
    ball.velX = 1;
    ball.velY = 1;
    ball.speed = 1;
}

function update(){
    let player = ball.x > 150 ? p2 : p1;
    ball.x += ball.velX;
    ball.y += ball.velY;
    
    if(ball.y >= 149 || ball.y - ball.r < 0){
        ball.velY = -ball.velY;
    }
    else if(collision(ball, player)){
        document.getElementById("bounce").play();
        let angle = (ball.y - (player.y + player.h/2))/(player.h/2)*Math.PI/4;
        let dir = player.id === 1 ? 1 : -1;
        ball.velX = dir*ball.speed*Math.cos(angle);
        ball.velY = ball.speed*Math.sin(angle);
        ball.speed += 0.1;
    }

    if(gameMode === 1 && player === p2){
        if(p2.y + p2.h/2 < ball.y && p2.y + p2.h < canvas.height)
            p2.y += p2.speed;
        else if(p2.y + p2.h/2 > ball.y && p2.y > 0)
            p2.y -= p2.speed;
    }

    if(ball.x - ball.r < 0){
        document.getElementById("goal").play();
        p2.score += 1;
        p2.speed = 0.8;
        resetBall();
    } else if(ball.x + ball.r >= 300){
        document.getElementById("goal").play();
        p1.score += 1;
        p2.speed += 0.1;
        resetBall();
    }
}

function play(){
    update();
    renderGame();
}

function reset(){
    p1.y = 0;
    p1.score = 0;
    p2.y = canvas.height-p2.h;
    p2.score = 0;
    resetBall();
}

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    movePlayer();
}, false);

function movePlayer() {

    if(keys["s"] && p1.y + p1.h < canvas.height)
        p1.y += 1.8;
    else if(keys["w"] && p1.y > 0)
        p1.y -= 1.8;

    if(gameMode === 2){
        if(keys["ArrowDown"] && p2.y + p2.h < canvas.height)
            p2.y += 1.8;
        else if(keys["ArrowUp"] && p2.y > 0)
            p2.y -= 1.8;
    }
}
 
 document.addEventListener('keyup', function(event) {
     console.log(event.key + " RELEASED");
     keys[event.key] = false;
 }, false);

  document.getElementById("reset").onclick = () =>{reset()};

  document.getElementById("change-mode").onclick = () => {
    gameMode = gameMode === 1 ? 2 : 1;
    document.getElementById("current-mode").innerText = gameMode === 1 ? "Current Mode: 1 Player"
                                                       : "Current Mode: 2 Players";
    reset();
  };

