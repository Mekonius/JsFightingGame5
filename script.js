const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const speed = 15;

const player = new Fighter({ 
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

const enemy = new Fighter({
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



let timer = 5
let timerId

const displayText = document.querySelector('#displayText')
const displayTextStyle = document.querySelector('#displayText').style
const displayTimer = document.querySelector('#timer')


function pickAWinner({ player, enemy, timerId }){
    clearTimeout(timerId)
    displayTextStyle.display = "flex"
    if(player.health === enemy.health){
        displayTimer.innerHTML = 'Draw'
        displayText.innerHTML = 'REMATCH !!!'
    } else if (player.health > enemy.health){
        displayText.innerHTML = 'Player Won!'
    } else if (enemy.health > player.health){
        displayText.innerHTML = 'Enemy Won!'
    }
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        displayTimer.innerHTML = timer
    }

    // 1 = set a value 
    // 2 == checks of the value is equal 
    // 3 === checks if the value and the type is equal

    if(timer === 0)
    {
        pickAWinner({player, enemy, timerId})
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

    }

    if (enemy.health <= 0 || player.health <= 0){
        pickAWinner({player, enemy, timerId})
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
        case 'ArrowDown':
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