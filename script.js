const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
class Player {
    constructor() {
        this.x = 50; this.y = 400;
        this.width = 30; this.height = 30;
        this.velY = 0; this.velX = 0;
        this.jumpPower = -10; this.gravity = 0.5;
    }
    update() {
        this.velY += this.gravity;
        this.y += this.velY;
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
const player = new Player();
function gameLoop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    requestAnimationFrame(gameLoop);
}
gameLoop();