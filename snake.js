
class Snake {
    constructor(x, y, size) {
        this.size = size;
        this.color = "white"
        this.xdir = 1;
        this.ydir = 0;
        this.tail = [];
        this.tail[0] = { x: x, y: y }
    }

    move() {
        var x = this.tail[this.tail.length - 1].x;
        var y = this.tail[this.tail.length - 1].y;
        x = x + this.size * this.xdir;
        y = y + this.size * this.ydir;

        this.tail.shift()
        this.tail.push({
            x: x,
            y: y
        })
    }
    goingToMoveTo() {
        var x = this.tail[this.tail.length - 1].x;
        var y = this.tail[this.tail.length - 1].y;
        x = x + this.size * this.xdir;
        y = y + this.size * this.ydir;
        return { x: x, y: y }
    }
}

class Apple {
    constructor() {
        while (true) {
            var x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            var y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;
            var isTouchingSnake = false;
            for (var i = 0; i < snake.tail.length; i++) {
                if (snake.tail[i].x == x && snake.tail[i].y == y) {
                    isTouchingSnake = true;
                    break;
                }
            }
            if (!isTouchingSnake) {
                break;
            }
        }
        this.size = snake.size;
        this.x = x;
        this.y = y;
        this.color = "red";
    }
}

function gameLoop() {
    fps = 15;
    setInterval(() => {
        update()
    }, 1000 / fps);
}

function show() {
    update();
    draw();
}

function update() {
    if (!eatApple()) {
        snake.move();
        checkHitWall()
        snake.moved = false
    }
    draw()
}

function draw() {
    drawRect(canvasContext, 0, 0, canvas.width, canvas.height, "black");
    drawRect(canvasScoreContext, 0, 0, canvasScore.width, canvasScore.height, "black");
    for (var i = 0; i < snake.tail.length; i++) {
        drawRect(
            canvasContext,
            snake.tail[i].x + 2.5,
            snake.tail[i].y + 2.5,
            snake.size - 5,
            snake.size - 5,
            snake.color
        );
    }
    drawRect(
        canvasContext,
        apple.x + 2.5,
        apple.y + 2.5,
        apple.size - 5,
        apple.size - 5,
        apple.color
    );
    canvasScoreContext.font = "10px Arial";
    canvasScoreContext.fillStyle = "#00FF00";
    canvasScoreContext.fillText("Score: " + (snake.tail.length - 1), 0, 18)
}

function drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function eatApple() {
    head = snake.goingToMoveTo()
    if (head.x == apple.x && head.y == apple.y) {
        snake.tail[snake.tail.length] = { x: apple.x, y: apple.y }
        apple = new Apple();
        return true
    }
}

function checkHitWall() {
    head = snake.tail[snake.tail.length - 1]
    x = head.x
    y = head.y
    console.log(x, -snake.size, x == -snake.size)
    if (x == -snake.size) {
        head.x = canvas.width - snake.size
    } else if (x == canvas.width) {
        head.x = -snake.size
    } else if (y == -snake.size) {
        head.y = canvas.width - snake.size
    } else if (y == canvas.height) {
        head.y = -snake.size
    }
}

canvas = document.getElementById("canvas");
canvasScore = document.getElementById("score-canvas");
canvasContext = canvas.getContext("2d");
canvasScoreContext = canvasScore.getContext("2d");
snake = new Snake(20, 20, 20);
apple = new Apple();

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if (snake.moved) {
            return
        }
        if (event.keyCode == 37 && snake.xdir != 1) {
            snake.xdir = -1;
            snake.ydir = 0;
            snake.moved = true;
        } else if (event.keyCode == 38 && snake.ydir != 1) {
            snake.xdir = 0;
            snake.ydir = -1;
            snake.moved = true;
        } else if (event.keyCode == 39 && snake.xdir != -1) {
            snake.xdir = 1;
            snake.ydir = 0;
            snake.moved = true;
        } else if (event.keyCode == 40 && snake.ydir != -1) {
            snake.xdir = 0;
            snake.ydir = 1;
            snake.moved = true;
        }
    }, 1);
})

gameLoop()