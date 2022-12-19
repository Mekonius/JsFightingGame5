const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const speed = 15;

class Sprite {
    constructor({position, velocity, color, offset}) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw() {
        // Player
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attack box
        if (this.isAttacking) {
            c.fillStyle = this.color;
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({ 
    position: {
        x: 0, 
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'red'
});

const keys = {
    w: {
        isDown: false
    },
    a: {
        isDown: false
    },
    d: {
        isDown: false
    },

    ArrowUp: {
        isDown: false
    },
    ArrowLeft: {
        isDown: false
    },
    ArrowRight: {
        isDown: false
    }
}

player.draw();

const enemy = new Sprite({
    position: {
        x: 400, 
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 50,
        y: 0
    },
    color: 'blue'
});

enemy.draw();

console.log(player);


function checkDeath() {
    if(player.health <= 0){
        alert("GAME OVER !!! player has died")
        if(comfirm("do you want to try again")) {
            location.reload();
        } else {
            alert("you are a coward !!!")
        }
    }
    if (enemy.health <= 0){
        alert("GAME OVER !!! enemy has died")
        if(confirm("you are to overpowered !!! do you want to humiliate the enemy again")) {
            location.reload();
        }
    }
}

function rectangularCollision({rect1, rect2}) {
    return (
        rect1.attackBox.position.x + 
        rect1.attackBox.width >= 
        rect2.position.x && 
        rect1.attackBox.position.x <= 
        rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= 
        rect2.position.y &&
        rect1.attackBox.position.y <= 
        rect2.position.y + rect2.height
    )
}



let timer = 3

function decreaseTimer() {
    if (timer > 0) {
        setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
}

decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movement
    if (keys.a.isDown && player.lastKey === 'a') {
        player.velocity.x = -speed;
    } else if (keys.d.isDown && player.lastKey === 'd') {
        player.velocity.x = speed;
    }

    // Enemy movement
    if (keys.ArrowLeft.isDown && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -speed;
    } else if (keys.ArrowRight.isDown && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = speed;
    }

    // Collision detection
    if (
        rectangularCollision({
            rect1: player,
            rect2: enemy
        }) && player.isAttacking 
    ) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + '%';
        checkDeath()
    }

    if (
        rectangularCollision({
            rect1: enemy,
            rect2: player
        }) && enemy.isAttacking 
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + '%' ;
        checkDeath()
    }

    
}



animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            player.velocity.y = -speed;
            break;
        case 'a':
            keys.a.isDown = true;
            player.lastKey = 'a'
            break;
        case 'd':
            keys.d.isDown = true;
            player.lastKey = 'd'
            break;
        case ' ':
            player.attack();
            break;

        case 'ArrowUp':
            enemy.velocity.y = -speed;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.isDown = true;
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight':
            keys.ArrowRight.isDown = true;
            enemy.lastKey = 'ArrowRight'
            break;
        case 'Control':
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.isDown = false;
            break;
        case 'd':
            keys.d.isDown = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.isDown = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.isDown = false;
            break;
    }
});