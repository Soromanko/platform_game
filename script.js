var canvas = document.getElementById('gc');
var ctx    = canvas.getContext('2d');
var W = 800, H = 450;

var score = 0, lives = 3, hi = 0;
var objects = [];
var spawnTimer = 0;
var player = { x: 360, y: 410, w: 80, h: 15, speed: 7 };
var keys = { left: false, right: false };
var gameRunning = false;

function spawnObject() {
    var types = ['coin', 'coin', 'coin', 'star', 'bomb'];
    var type  = types[Math.floor(Math.random() * types.length)];
    objects.push({
        x:     Math.random() * (W - 30) + 15,
        y:     -20,
        speed: 2 + Math.random() * 2 + score / 300,
        type:  type
    });
}

function drawObject(o) {
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var emoji = { coin: '🟡', star: '⭐', bomb: '💣' }[o.type];
    ctx.fillText(emoji, o.x, o.y);
}

function drawPlayer() {
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
}

function updateHUD() {
    document.getElementById('sv').textContent = score;
    document.getElementById('hh').textContent = hi;
    var hearts = '';
    for (var i = 0; i < 3; i++) {
        hearts += i < lives ? '❤️ ' : '🖤 ';
    }
    document.getElementById('lv').textContent = hearts;
}

function loop() {
    if (!gameRunning) return;

    if (keys.left  && player.x > 0)        player.x -= player.speed;
    if (keys.right && player.x < W - player.w) player.x += player.speed;

    spawnTimer++;
    if (spawnTimer > 60) {
        spawnTimer = 0;
        spawnObject();
    }

    ctx.fillStyle = '#dde8ff';
    ctx.fillRect(0, 0, W, H);

    for (var i = objects.length - 1; i >= 0; i--) {
        var o = objects[i];
        o.y += o.speed;

        drawObject(o);

        if (o.x > player.x && o.x < player.x + player.w &&
            o.y + 14 > player.y && o.y - 14 < player.y + player.h) {

            if (o.type === 'bomb') {
                lives--;
                updateHUD();
                if (lives <= 0) { gameRunning = false; endGame(); return; }
            } else {
                var points = { coin: 10, star: 50};
                score += points[o.type];
                updateHUD();
            }
            objects.splice(i, 1);
            continue;
        }

        if (o.y > H + 30) {
            objects.splice(i, 1);
        }
    }

    drawPlayer();
    requestAnimationFrame(loop);
}

function endGame() {
    if (score > hi) hi = score;
    document.getElementById('fs').textContent = score;
    document.getElementById('fh').textContent = hi;
    document.getElementById('hv').textContent = hi;
    showScreen('sgo');
}

function showScreen(id) {
    ['sm', 'sg', 'sgo'].forEach(function(s) {
        document.getElementById(s).classList.remove('on');
    });
    document.getElementById(id).classList.add('on');
}

function startGame() {
    score = 0; lives = 3;
    objects = []; spawnTimer = 0;
    player.x = 360;
    gameRunning = true;
    updateHUD();
    showScreen('sg');
    loop();
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
});
document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

document.getElementById('sb').addEventListener('click', startGame);
document.getElementById('rb').addEventListener('click', startGame);
document.getElementById('mb').addEventListener('click', function() {
    gameRunning = false;
    showScreen('sm');
});

showScreen('sm');