let type = "webGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

PIXI.utils.sayHello(type);

let Application = PIXI.Application;
let Graphics = PIXI.Graphics;
let loader = PIXI.loader;
let textureCache = PIXI.utils.TextureCache;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

let app = new Application({
    width: 900,
    height: 300,
    antialias: true,
    transparent: false,
    resolutioun: 1
});
app.renderer.backgroundColor = 0x061639;

document.body.appendChild(app.view);

let player, opponent, state, timeLimit;
const numQuestions = 10;
let level = 1;
let answer;
let numAsked, numCorrect, numWrong = 0;
let levelEl = document.getElementById('level');
let inputEl = document.getElementById('number');
let first = document.getElementById('first');
let second = document.getElementById('second');
let submit = document.getElementById('submit');
let submission = document.getElementById('number');
let correctEl = document.getElementById('correct');
let wrongEl = document.getElementById('wrong');
let sumCard = document.getElementById('sum');
let controlCard = document.getElementById('control');
let startButton = document.getElementById('start');
let nextButton = document.getElementById('nextlevel');
let retryButton = document.getElementById('retry');
let winnerEl = document.getElementById('winner');
let loserEl = document.getElementById('loser');

PIXI.loader
    // .add({
    //     url: "./assets/sprites/blue_boi.jpg",
    //     crossOrigin: true
    // })
    // .add({
    //     url: "./assets/sprites/oranger.jpg",
    //     crossOrigin: true
    // })
    .load(setup);

function setup() {
    player = new Graphics();
    player.beginFill(0x551020);
    player.lineStyle(4, 0x000000, 1);
    player.drawRect(10,10,75,75);
    player.endFill();
    // player.position.set(5, 5);

    opponent = new Graphics();
    opponent.beginFill(0x227720);
    opponent.lineStyle(4, 0x000000, 1);
    opponent.drawRect(10,155,75,75);
    opponent.endFill();
    // opponent.position.set(5, 5);
    
    // opponent = new Graphics();
    // opponent.beginFill(0x55555);
    // opponent.lineStyle(4, 0x000000, 1);
    // opponent.drawRect(5,155,75,75);
    // opponent.endFill();
    // opponent.x = 5;
    // opponent.y = 155;
    //     resources["./assets/sprites/oranger.jpg"].texture
    // );
    // opponent.width = opponent.height = 75;
    // opponent.vx = 0;
    // opponent.beginFill(0x5f63f3);
    // opponent.lineStyle(4, 0x000000);
    // opponent.drawRect(75,75,150,150);
    // opponent.endFill();
    // opponent.position.set(5, 155);

    app.stage.addChild(player);
    app.stage.addChild(opponent);

    state = start;
    // state = play;
    app.ticker.add(delta => gameLoop(delta));
    app.ticker.add(delta => move(delta));
}

function move(delta) {
    opponent.x += opponent.vx;
    if (opponent.x >= app.screen.width - 5) {
        state = end;
    }
}

function gameLoop(delta) {
    state(delta);
}

function start(delta) {
    sumCard.style.display = "none";
    controlCard.style.display = "block";
    startButton.style.display = "block";
    nextButton.style.display = "none";
    retryButton.style.display = "none";

    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        nextButton.style.display = "block";
        retryButton.style.display = "block";
        controlCard.style.display = "none";
        sumCard.style.display = "flex";

        resetLevel(false);
        state = play;
    });
}

function play(delta) {
    opponent.vx = (app.screen.width - 20.0) / timeLimit;

    // wrongEl.style.display = "none";
    // correctEl.style.display = "none";
    
    // console.log('Question ' + numAsked);
    // console.log('Right: ' + numCorrect);
    if (numCorrect >= numQuestions) {
        state = end;
    }
}

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function checkAnswer() {
    if (state == play) {
        if (answer == submission.value) {
            // state = play;
            console.log('Correct!');
            wrongEl.style.display = "none";
            correctEl.style.display = "block";
            player.x += (app.screen.width - 20.0) / numQuestions;
            numCorrect++;
        } else {
            console.log('Wrong!');
            numWrong++;
            wrongEl.style.display = "block";
            correctEl.style.display = "none";
            // state = play;
        }

        answer = generateQuestion();
        submission.focus();
        submission.value = null;
    }
}

function end(delta) {
    opponent.vx = 0;
    sumCard.style.display = "none";
    controlCard.style.display = "flex";
    retryButton.style.display = "block";
    if (player.x >= opponent.x) {
        // WIN
        winnerEl.style.display = "block";
        nextButton.style.display = "block";
    } else {
        // LOSE
        loserEl.style.display = "block";
    }
    submission.focus();
    submission.value = null;

}

function resetLevel(goToNextLevel) {

    if (goToNextLevel) {
        levelEl.innerText = ++level;
    }

    numAsked = numCorrect = numWrong = 0;

    timeLimit = 1000 * (11.0 - level);  // milliseconds
    player.x = 10;
    opponent.x = 10;

    answer = generateQuestion();
}

function proceedToNextLevel() {
    if (state == end) {
        winnerEl.style.display = "none";
        nextButton.style.display = "none";
        controlCard.style.display = "none";
        sumCard.style.display = "flex";
        resetLevel(true);
        state = play;
    }
}

function repeatCurrentLevel() {
    if (state == end) {
        winnerEl.style.display = "none";
        nextButton.style.display = "none";
        controlCard.style.display = "none";
        sumCard.style.display = "flex";
        resetLevel(false);
        state = play;
    }
}

function generateQuestion() {
    let s1 = Math.floor(Math.random() * 11);
    first.innerText = s1;
    let s2 = Math.floor(Math.random() * 11);
    second.innerText = s2;
    return s1 + s2;
}