// Game Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 512;

// Game Variables
const playerImg = new Image();
playerImg.src = "https://deepsheikh.tech/deepsheikh_icon.png";

const bulletUpImg = new Image();
bulletUpImg.src = "https://cdn.discordapp.com/attachments/1127326309081686189/1339166652104835154/20250212_152925.png?ex=67adbba2&is=67ac6a22&hm=eb3013d965d2fa9da2adcbc10cd8cefe8c704fd9d862272265e5b0625aebfd5c&";

const bulletDownImg = new Image();
bulletDownImg.src = "https://cdn.discordapp.com/attachments/1127326309081686189/1339166683193020496/20250212_152937.png?ex=67adbba9&is=67ac6a29&hm=aed39742bd5e9cd6258a8613a17b1c893aae84bd1c6cf6375923a51efb775196&";

const collisionSound = new Audio("https://cdn.discordapp.com/attachments/1127326309081686189/1339143763632590858/AQMCHtuiiCwXv0NmSrhRnH1fh5XHNI0a-MVmamTpH23VEZ34dDpT40KA_HkFLBqL_rYyN33BXGYK_CdGWJtgOSv8.mp3?ex=67ada651&is=67ac54d1&hm=442d26294cc299d7f891aa7867d693760aa5e26f64be74e3386d606ff9b74a3d&");

const restartSound = new Audio("https://cdn.discordapp.com/attachments/1127326309081686189/1339143555012104194/Audio_2025_02_12_13_36_27.mp3?ex=67ada61f&is=67ac549f&hm=45e8f8a7d170ac61914bbaa91c7474708e72142d5339409c71dc0af36a11f4a7&");

let player = { x: 900, y: 200, width: 50, height: 50, velocityY: 0, gravity: 0.5 };
let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", () => { if (!gameOver) player.velocityY = -8; });

function createObstacle() {
    let gapY = Math.random() * (canvas.height - 200) + 50;
    obstacles.push({ x: -100, y: gapY - 150, width: 50, height: 150, type: "up" });
    obstacles.push({ x: -100, y: gapY + 50, width: 50, height: 150, type: "down" });
}

function update() {
    if (gameOver) return;

    frame++;
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (frame % 60 === 0) createObstacle();

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x += 4;

        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            collisionSound.play();
            gameOver = true;
            setTimeout(restartGame, 2000);
        }

        if (obstacles[i].x === 900) score++;
    }

    if (score >= 32) {
        gameOver = true;
        restartSound.play();
        setTimeout(restartGame, 2000);
    }

    if (player.y >= canvas.height || player.y <= 0) {
        collisionSound.play();
        gameOver = true;
        setTimeout(restartGame, 2000);
    }
}

function restartGame() {
    player.y = 200;
    player.velocityY = 0;
    obstacles = [];
    score = 0;
    frame = 0;
    gameOver = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let i = 0; i < obstacles.length; i++) {
        let img = obstacles[i].type === "up" ? bulletUpImg : bulletDownImg;
        ctx.drawImage(img, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();