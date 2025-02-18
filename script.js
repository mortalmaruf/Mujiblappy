document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.getElementById('gameCanvas').appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2; // 2:1 aspect ratio

    const birdImg = new Image();
    birdImg.src = 'https://deepsheikh.tech/deepsheikh_icon.png';

    const bulletUp = new Image();
    bulletUp.src = 'https://cdn.discordapp.com/attachments/1127326309081686189/1339166652104835154/20250212_152925.png?ex=67adbba2&is=67ac6a22&hm=eb3013d965d2fa9da2adcbc10cd8cefe8c704fd9d862272265e5b0625aebfd5c&';
    const bulletDown = new Image();
    bulletDown.src = 'https://cdn.discordapp.com/attachments/1127326309081686189/1339166683193020496/20250212_152937.png?ex=67adbba9&is=67ac6a29&hm=aed3742bd5e9cd6258a8613a17b1c893aae84bd1c6cf6375923a51efb775196&';

    let bird = { x: canvas.width, y: canvas.height / 2, velocity: 0, gravity: 0.25 };
    let obstacles = [];
    let score = 0;
    let gameOver = false;
    let obstacleCount = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(birdImg, bird.x, bird.y, 50, 50);

        obstacles.forEach((obstacle, index) => {
            ctx.drawImage(bulletUp, obstacle.x, obstacle.top, 50, 100);
            ctx.drawImage(bulletDown, obstacle.x, obstacle.bottom, 50, 100);

            if (bird.x < obstacle.x + 50 && bird.x + 50 > obstacle.x && 
                (bird.y < obstacle.top || bird.y + 50 > obstacle.bottom)) {
                gameOver = true;
                new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143763632590858/AQMCHtuiiCwXv0NmSrhRnH1fh5XHNI0a-MVmamTpH23VEZ34dDpT40KA_HkFLBqL_rYyN33BXGYK_CdGWJtgOSv8.mp3?ex=67ada651&is=67ac54d1&hm=442d26294cc299d7f891aa7867d693760aa5e26f64be74e3386d606ff9b74a3d&').play();
            }

            if (obstacle.x + 50 < bird.x && !obstacle.passed) {
                obstacle.passed = true;
                score += 1;
                obstacleCount++;
            }

            obstacle.x -= 2;
            if (obstacle.x + 50 < 0) obstacles.splice(index, 1);
        });

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y > canvas.height - 50 || bird.y < 0) gameOver = true;

        document.getElementById('scoreValue').textContent = score;

        if (obstacleCount < 32 && !gameOver) {
            if (Math.random() > 0.99) {
                let gap = Math.floor(Math.random() * (canvas.height - 200)) + 100;
                obstacles.push({
                    x: canvas.width,
                    top: 0,
                    bottom: gap + 100,
                    passed: false
                });
            }
        } else if (obstacleCount === 32 && obstacles.length === 0) {
            new Audio('https://cdn.discordapp.com/attachments/1127326309081686189/1339143555012104194/Audio_2025_02_12_13_36_27.mp3?ex=67ada61f&is=67ac549f&hm=45e8f8a7d170ac61914bbaa91c7474708e72142d5339409c71dc0af36a11f4a7&').play();
            setTimeout(() => {
                resetGame();
            }, 3000);
        }

        if (!gameOver) requestAnimationFrame(draw);
    }

    function resetGame() {
        bird = { x: canvas.width, y: canvas.height / 2, velocity: 0, gravity: 0.25 };
        obstacles = [];
        score = 0;
        obstacleCount = 0;
        gameOver = false;
        draw();
    }

    document.addEventListener('click', () => {
        if (!gameOver) bird.velocity = -5;
    });

    draw();
});