const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 350; // Bird starts on the right side
let birdY = canvas.height / 2;
const birdWidth = 50;
const birdHeight = 50;
let gravity = 0.5;
let velocity = 0;
let jumpStrength = -10;
let pipeWidth = 70;
let pipeGap = 150;
let pipeSpeed = 2; // Pipes move to the left
let pipes = [];
let score = 0;
let gameStarted = false;
let gameOver = false;
let score32SoundPlayed = false;

// Load images and sounds
const birdImage = new Image();
birdImage.src = 'https://deepsheikh.tech/deepsheikh_icon.png';
const crashSound = new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143763632590858/AQMCHtuiiCwXv0NmSrhRnH1fh5XHNI0a-MVmamTpH23VEZ34dDpT40KA_HkFLBqL_rYyN33BXGYK_CdGWJtgOSv8.mp3?ex=67ada651&is=67ac54d1&hm=442d26294cc299d7f891aa7867d693760aa5e26f64be74e3386d606ff9b74a3d&');
const score32Sound = new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143555012104194/Audio_2025_02_12_13_36_27.mp3?ex=67ada61f&is=67ac549f&hm=45e8f8a7d170ac61914bbaa91c7474708e72142d5339409c71dc0af36a11f4a7&');

// Function to generate pipes
function generatePipes() {
    let gapY = Math.random() * (canvas.height - pipeGap - 200) + 100; // Random gap position
    let pipe = {
        x: 0, // Pipes start from the right and move left
        topPipeHeight: gapY - pipeGap / 2,
        bottomPipeHeight: canvas.height - (gapY + pipeGap / 2),
        passed: false // To track if bird has passed this pipe for scoring
    };
    pipes.push(pipe);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    if (!gameStarted || gameOver) return;

    velocity += gravity;
    birdY += velocity;

    // Bird boundaries
    if (birdY < 0) {
        birdY = 0;
        velocity = 0;
    }
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight;
        gameOverSequence();
    }


    // Pipe generation and movement
    if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 300) { // Generate pipes more frequently
        generatePipes();
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x += pipeSpeed; // Move pipes to the right (bird moves left visually)

        // Scoring
        if (pipes[i].x + pipeWidth < birdX && !pipes[i].passed) {
            score++;
            pipes[i].passed = true;
            if (score === 32 && !score32SoundPlayed) {
                playSound(score32Sound);
                score32SoundPlayed = true; // Prevent playing sound multiple times
            }
        }

        // Collision detection
        if (birdX < pipes[i].x + pipeWidth &&
            birdX + birdWidth > pipes[i].x &&
            (birdY < pipes[i].topPipeHeight || birdY + birdHeight > canvas.height - pipes[i].bottomPipeHeight)) {
            gameOverSequence();
        }

        // Remove off-screen pipes
        if (pipes[i].x > canvas.width) {
            pipes.splice(i, 1);
            i--;
        }
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw bird (image) - Bird is flying right to left, so it's on the right side initially
    ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    // Draw pipes
    ctx.fillStyle = 'green';
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topPipeHeight); // Top pipe
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomPipeHeight, pipeWidth, pipe.bottomPipeHeight); // Bottom pipe
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    // Game Over message
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over! Tap to Restart', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left'; // Reset text alignment
    }

    // Start message
    if (!gameStarted && !gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Tap to Start', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left'; // Reset text alignment
    }
}

// Bird flap function
function flap() {
    if (!gameStarted) {
        gameStarted = true;
        if (gameOver) {
            restartGame(); // Restart if game over
        }
    }
    if (!gameOver) {
        velocity = jumpStrength;
    } else {
        restartGame(); // Restart game on tap if game over
    }
}

// Game Over sequence
function gameOverSequence() {
    gameOver = true;
    gameStarted = false; // Stop game updates in gameLoop
    playSound(crashSound);
}

// Restart Game function
function restartGame() {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    score32SoundPlayed = false;
    gameStarted = true; // Start game immediately after restart
}

// Play sound function
function playSound(sound) {
    sound.currentTime = 0; // Rewind to the beginning
    sound.play();
}


// Event listeners for input
canvas.addEventListener('touchstart', flap); // For touch on phones
canvas.addEventListener('mousedown', flap);   // For mouse clicks on computers (if you test on desktop later)

// Start the game loop
gameLoop();