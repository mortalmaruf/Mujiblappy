const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const birdImg = new Image();
birdImg.src = "https://deepsheikh.tech/deepsheikh_icon.png";

const crashSound = new Audio("https://cdn.discordapp.com/attachments/1127326309081686189/1339143763632590858/AQMCHtuiiCwXv0NmSrhRnH1fh5XHNI0a-MVmamTpH23VEZ34dDpT40KA_HkFLBqL_rYyN33BXGYK_CdGWJtgOSv8.mp3");
const winSound = new Audio("https://cdn.discordapp.com/attachments/1127326309081686189/1339143555012104194/Audio_2025_02_12_13_36_27.mp3");

let bird = { x: 700, y: 200, width: 50, height: 50, velocityY: 0 };
let gravity = 0.5;
let pipes = [];
let frame = 0;
let score = 0;
let gameRunning = true;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocityY += gravity;
    bird.y += bird.velocityY;
}

function createPipes() {
    if (frame % 100 === 0) {
        let gap = 150;
        let topPipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
        let bottomPipeY = topPipeHeight + gap;

        pipes.push({ x: 0, topHeight: topPipeHeight, bottomY: bottomPipeY, width: 50 });
    }
}

function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x += 2;

        if (pipes[i].x > 800) {
            pipes.splice(i, 1);
            score++;
            if (score === 32) {
                winSound.play();
                resetGame();
            }
        }
    }
}

function drawPipes() {
    ctx.fillStyle = "green";
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
    }
}

function checkCollision() {
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)) {
            crashSound.play();
            resetGame();
        }
    }

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        crashSound.play();
        resetGame();
    }
}

function resetGame() {
    bird = { x: 700, y: 200, width: 50, height: 50, velocityY: 0 };
    pipes = [];
    frame = 0;
    score = 0;
}

document.addEventListener("keydown", () => {
    bird.velocityY = -8;
});

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBird();
    drawBird();

    createPipes();
    movePipes();
    drawPipes();
    
    checkCollision();

    frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
