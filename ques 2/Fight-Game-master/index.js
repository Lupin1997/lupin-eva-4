const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;
const keys = { a: false, d: false, w: false, ArrowLeft: false, ArrowRight: false, ArrowUp: false };

context.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({ position: { x: 0, y: 0 }, imageSrc: './backgrounds/Background1.png' });
const shop = new Sprite({ position: { x: 700, y: 170 }, imageSrc: './backgrounds/shop_anim.png', scale: 2.5, framesMax: 6 });

const player = new Fighter({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle: { imageSrc: './img/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/Attack1.png', framesMax: 6 },
        takeHit: { imageSrc: './img/TakeHitWhite.png', framesMax: 4 },
        death: { imageSrc: './img/Death.png', framesMax: 6 }
    },
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 }
});

const enemy = new Fighter({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    imageSrc: './img/Idle2.png',
    framesMax: 4,
    scale: 2.5,
    offset: { x: 215, y: 170 },
    sprites: {
        idle: { imageSrc: './img/Idle2.png', framesMax: 4 },
        run: { imageSrc: './img/Run2.png', framesMax: 8 },
        jump: { imageSrc: './img/Jump2.png', framesMax: 2 },
        fall: { imageSrc: './img/Fall2.png', framesMax: 2 },
        attack1: { imageSrc: './img/Attack12.png', framesMax: 4 },
        takeHit: { imageSrc: './img/Hit2.png', framesMax: 3 },
        death: { imageSrc: './img/Death2b.png', framesMax: 7 }
    },
    attackBox: { offset: { x: -170, y: 50 }, width: 170, height: 50 }
});

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = keys.a && player.lastkey === 'a' ? -5 : keys.d && player.lastkey === 'd' ? 5 : 0;
    player.switchSprite(player.velocity.y < 0 ? 'jump' : player.velocity.y > 0 ? 'fall' : player.velocity.x !== 0 ? 'run' : 'idle');

    enemy.velocity.x = keys.ArrowLeft && enemy.lastkey === 'ArrowLeft' ? -5 : keys.ArrowRight && enemy.lastkey === 'ArrowRight' ? 5 : 0;
    enemy.switchSprite(enemy.velocity.y < 0 ? 'jump' : enemy.velocity.y > 0 ? 'fall' : enemy.velocity.x !== 0 ? 'run' : 'idle');

    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.frameCurrent === 4) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', { width: enemy.health + '%' });
    }
    
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', { width: player.health + '%' });
    }

    if (enemy.health <= 0 || player.health <= 0) determinewinner({ player, enemy, timerId });
}

animate();

window.addEventListener('keydown', ({ key }) => {
    if (!player.dead) {
        if (key === 'd') { keys.d = true; player.lastkey = 'd'; }
        if (key === 'a') { keys.a = true; player.lastkey = 'a'; }
        if (key === 'w') player.velocity.y = -20;
        if (key === ' ') player.attack();
    }
    if (!enemy.dead) {
        if (key === 'ArrowRight') { keys.ArrowRight = true; enemy.lastkey = 'ArrowRight'; }
        if (key === 'ArrowLeft') { keys.ArrowLeft = true; enemy.lastkey = 'ArrowLeft'; }
        if (key === 'ArrowUp') enemy.velocity.y = -20;
        if (key === 'ArrowDown') enemy.attack();
    }
});

window.addEventListener('keyup', ({ key }) => {
    if (key === 'd') keys.d = false;
    if (key === 'a') keys.a = false;
    if (key === 'ArrowRight') keys.ArrowRight = false;
    if (key === 'ArrowLeft') keys.ArrowLeft = false;
});
