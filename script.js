document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.getElementById('gameCanvas').appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2; // 2:1 aspect ratio

    const birdImg = new Image();
    birdImg.src = 'https://deepsheikh.tech/deepsheikh_icon.png';

    const bulletUp = new Image();
    bulletUp.src = 'https://cdn.discordapp.com/attachments/1127326309081686189/1339166652104835154/20250212_152925.png';
    const bulletDown = new Image();
    bulletDown.src = 'https://cdn.discordapp.com/attachments/1127326309081686189/1339166683193020496/20250212_152937.png';

    let bird = { x: canvas.width - 50, y: canvas.height / 2, velocity: 0, gravity: 0.25 };
    let obstacles = [];
    let score = 0;
    let gameOver = false;
    let obstacleCount = 0;
    let lastTime = 0;

    function draw(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(birdImg, bird.x, bird.y, 50, 50);

        // Move and draw obstacles
        obstacles.forEach((obstacle, index) => {
            ctx.drawImage(bulletUp, obstacle.x, obstacle.top, 50, 100);
            ctx.drawImage(bulletDown, obstacle.x, obstacle.bottom, 50, 100);

            if (isColliding(bird, obstacle)) {
                gameOver = true;
                new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143763632590858/AQMCHtuiiCwXv0NmSrhRnH1fh5XHNI0a-MVmamTpH23VEZ34dDpT40KA_HkFLBqL_rYyN33BXGYK_CdGWJtgOSv8.mp3').play();
            }

            if (obstacle.x + 50 < bird.x && !obstacle.passed) {
                obstacle.passed = true;
                score += 1;
                obstacleCount++;
            }

            obstacle.x -= 2 * (deltaTime / 16); // Normalize speed with deltaTime
            if (obstacle.x + 50 < 0) obstacles.splice(index, 1);
        });

        bird.velocity += bird.gravity;
        bird.y += bird.velocity * (deltaTime / 16);

        if (bird.y > canvas.height - 50 || bird.y < 0) gameOver = true;

        document.getElementById('scoreValue').textContent = score;

        if (obstacleCount < 32 && !gameOver) {
            if (Math.random() > 0.98) { // Increased frequency
                let gap = Math.floor(Math.random() * (canvas.height - 200)) + 100;
                obstacles.push({
                    x: canvas.width,
                    top: 0,
                    bottom: gap + 100,
                    passed: false
                });
            }
        } else if (obstacleCount === 32 && obstacles.length === 0) {
            new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143555012104194/Audio_2025_02_12_13_36_27.mp3').play();
            setTimeout(() => {
                resetGame();
            }, 3000);
        }

        if (!gameOver) requestAnimationFrame(draw);
    }

    function resetGame() {
        bird = { x: canvas.width - 50, y: canvas.height / 2, velocity: 0, gravity: 0.25 };
        obstacles = [];
        score = 0;
        obstacleCount = 0;
        gameOver = false;
        lastTime = 0;
        draw(performance.now());
    }

    function isColliding(bird, obstacle) {
        return (bird.x < obstacle.x + 50 && 
                bird.x + 50 > obstacle.x && 
                (bird.y < obstacle.top + 100 || bird.y + 50 > obstacle.bottom));
    }

    document.addEventListener('click', () => {
        if (!gameOver) bird.velocity = -5;
    });

    // Wait for images to load before starting the game
    Promise.all([new Promise(resolve => birdImg.onload = resolve), 
                 new Promise(resolve => bulletUp.onload = resolve),
                 new Promise(resolve => bulletDown.onload = resolve)]).then(() => {
        draw(performance.now());
    }).catch(console.error);
});