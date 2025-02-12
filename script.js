document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions for 2:1 aspect ratio
    canvas.width = 1200; // Example width
    canvas.height = 600; // Example height, adjust as needed

    let background = new Image();
    background.src = 'https://media.istockphoto.com/id/981726654/vector/underwater-landscape-game-background.jpg?s=612x612&w=0&k=20&c=-kQavWXCeUIonsSEB5NCkNs5ddmtcp2i8SsFH8Uw0w4=';
    let playerImg = new Image();
    playerImg.src = 'https://deepsheikh.tech/deepsheikh_icon.png';
    let bulletUpImg = new Image();
    bulletUpImg.src = 'https://cdn.discordapp.com/attachments/1127326309081686189/1339166652104835154/20250212_152925.png?ex=67adbba2&is=67ac6a22&hm=eb3013d965d2fa9da2adcbc10cd8cefe8c704fd9d862272265e5b0625aebfd5c&';
    let bulletDownImg = new Image();
    bulletDownImg.src = 'https://cdn.discordapp.com/attachments/1127326309081686189/1339166683193020496/20250212_152937.png?ex=67adbba9&is=67ac6a29&hm=aed39742bd5e9cd6258a8613a17b1c893aae84bd1c6cf6375923a51efb775196&';
    let gameOverSound = new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143763632590858/AQMCHtuiiCwXv0NmSrhRnH1fh5XHNI0a-MVmamTpH23VEZ34dDpT40KA_HkFLBqL_rYyN33BXGYK_CdGWJtgOSv8.mp3?ex=67ada651&is=67ac54d1&hm=442d26294cc299d7f891aa7867d693760aa5e26f64be74e3386d606ff9b74a3d&');
    let gameRestartSound = new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143555012104194/Audio_2025_02_12_13_36_27.mp3?ex=67ada61f&is=67ac549f&hm=45e8f8a7d170ac61914bbaa91c7474708e72142d5339409c71dc0af36a11f4a7&');

    let player = {
        x: canvas.width - 100, // Start from right
        y: canvas.height / 2,
        width: 50,
        height: 50,
        velocityY: 0,
        gravity: 0.5,
        flapStrength: -10
    };

    let obstacles = [];
    let obstacleWidth = 70;
    let obstacleGap = player.height * 5;
    let obstacleSpeed = 3;
    let score = 0;
    let gameOver = false;
    let obstacleCount = 0;
    const totalObstaclesForRestart = 32;

    function generateObstacle() {
        let obstacleHeightTop = Math.random() * (canvas.height / 2.5) + 50; // Random height for top obstacle
        let obstacleHeightBottom = canvas.height - obstacleHeightTop - obstacleGap;
        let obstacleX = 0; // Start from left and move to right

        obstacles.push({
            x: canvas.width,
            yTop: 0,
            width: obstacleWidth,
            heightTop: obstacleHeightTop,
            counted: false,
            type: 'top'
        });
        obstacles.push({
            x: canvas.width,
            yBottom: obstacleHeightTop + obstacleGap,
            width: obstacleWidth,
            heightBottom: obstacleHeightBottom,
            counted: false,
            type: 'bottom'
        });
    }

    function moveObstacles() {
        if (obstacles.length > 0) {
            for (let i = 0; i < obstacles.length; i++) {
                obstacles[i].x -= obstacleSpeed;
            }

            // Remove obstacles that are off screen
            if (obstacles[0].x + obstacleWidth < 0) {
                obstacles.shift();
                obstacles.shift(); // remove both top and bottom
            }
        }
    }

    function drawObstacles() {
        for (let i = 0; i < obstacles.length; i += 2) {
            const topObstacle = obstacles[i];
            const bottomObstacle = obstacles[i+1];

            if (topObstacle) {
                ctx.drawImage(bulletDownImg, topObstacle.x, topObstacle.yTop, topObstacle.width, topObstacle.heightTop);
            }
            if (bottomObstacle) {
                ctx.drawImage(bulletUpImg, bottomObstacle.x, bottomObstacle.yBottom, bottomObstacle.width, bottomObstacle.heightBottom);
            }
        }
    }


    function drawPlayer() {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    function updatePlayer() {
        player.velocityY += player.gravity;
        player.y += player.velocityY;

        // Keep player within bounds (optional, can remove for flappy bird style)
        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
        }
    }

    function checkCollision() {
        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < (obstacle.type === 'top' ? obstacle.heightTop : canvas.height) &&
                player.y + player.height > (obstacle.type === 'top' ? 0 : obstacle.yBottom)) {
                gameOver = true;
                gameOverSound.play();
                break;
            }

            if (obstacle.type === 'top' && obstacle.x + obstacle.width < player.x && !obstacle.counted) {
                score++;
                obstacleCount++;
                obstacle.counted = true;
                if (obstacleCount >= totalObstaclesForRestart) {
                    gameRestartSound.play();
                    resetGame();
                    obstacleCount = 0;
                }
            }
        }

        if (player.y + player.height > canvas.height || player.y < 0) {
            gameOver = true;
            gameOverSound.play();
        }
    }


    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2 - 50, 50);
    }

    function resetGame() {
        player.y = canvas.height / 2;
        player.velocityY = 0;
        obstacles = [];
        score = 0;
        gameOver = false;
        obstacleSpeed = 3; // Reset obstacle speed
        obstacleCount = 0;
        generateObstacle(); // Generate initial obstacles
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            moveObstacles();
            generateObstacleIfNeeded();
            drawObstacles();
            updatePlayer();
            checkCollision();
        } else {
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over! Score: ' + score, canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
        }

        drawPlayer();
        drawScore();
        requestAnimationFrame(gameLoop);
    }

    function generateObstacleIfNeeded() {
        if (obstacles.length === 0 || obstacles[obstacles.length - 2].x < canvas.width - 400) { // Generate new obstacle when the last one is 400px from right edge
            generateObstacle();
        }
    }


    document.addEventListener('mousedown', () => {
        if (gameOver) {
            resetGame();
        } else {
            player.velocityY = player.flapStrength;
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // prevent default spacebar action
            if (gameOver) {
                resetGame();
            } else {
                player.velocityY = player.flapStrength;
            }
        }
    });


    // Start game when player image is loaded
    playerImg.onload = () => {
        generateObstacle(); // Initial obstacles
        gameLoop();
    };
});