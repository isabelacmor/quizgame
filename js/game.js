var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvas.font = "20px Courier New";
canvasElement.appendTo('body');

var scoreDiv, questionDiv, loadingDiv;
window.onload = function () {
	scoreDiv = document.getElementById("score");
	questionDiv = $("#question");
	loadingDiv = $("#loading");
}

var FPS = 30;
var refreshInterval = setInterval(function() {
  update();
  draw();
}, 1000/FPS);

var data = window.localStorage;
var answers = [];
var questions = [];
var posX = [];
var posY = [];

var score = 0;
var curQ = 0;
var complete = 0;
var curAns = "";
var curQues = "";

// Store all answers (approx. 12px per char)
for(var i = 0; i < data.length; i++) {
	questions[i] = data.key(i);
	answers[i] = data.getItem(data.key(i));
	posX[i] = (CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2);
	posY[i] = (CANVAS_HEIGHT / 4 + Math.random() * CANVAS_HEIGHT / 2);
}

curAns = answers[0];
curQues = questions[0];

// Set up the shooter
var player = {
	color: "#00A", x: 220, y: 270, width: 32, height: 32,
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
};

function draw() {
	// Clear the entire canvas
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// Draw the player
	player.draw();

	// Draw the answers
	drawAnswers();

	// Draw the score
	scoreDiv.innerHTML = "Score: " + score;
}

function update() {
	movePlayer();
	handleCollisions();

	// Game over
	if( curAns === undefined || curQues === undefined) {
		clearInterval(refreshInterval);
		$("#loadingText").text("You win! Final score: " + score);
		canvasElement.hide();
		loadingDiv.show();
	}
}

function drawAnswers() {
	// Display all answers on screen originally
	canvas.fillStyle = "#000";
	for(var i = 0; i < answers.length; i++){
		canvas.fillText(answers[i], posX[i], posY[i]);
		canvas.fillStyle = "#F00";
		//canvas.fillRect(posX[i], posY[i], answers[i].length*12, 15);
	}
}

function updateAnswers() {
	for(var i = 0; i < data.length; i++) {
		answers[i] = data.getItem(data.key(i));
		posX[i] = (CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2);
		posY[i] = (CANVAS_HEIGHT / 4 + Math.random() * CANVAS_HEIGHT / 2);
	}

	// Choose the next question
	curAns = answers[complete];
	curQues = questions[complete];

	console.log("current A: " + curAns);
	console.log("current Q: " + curQues);
	questionDiv.innerHTML = "Question: " + curQues;
}

function handleCollisions() {
	for(var i = 0; i < answers.length; i++){
		if(collides(player.x, player.y, player.width, player.height, posX[i], posY[i], answers[i].length*12, 15)){
			// Remove from answers
			var tempAns = answers[i];
			var x = answers.indexOf(answers[i]);	// lol, I'm dumb
			if(x != -1) {
				answers.splice(x, 1);
				posX.splice(x, 1);
				posY.splice(x, 1);
			}

			// Check if correct answer
			if(tempAns === curAns){
				score += 20;
				complete++;
				console.log("right answer!");
				updateAnswers();
				prep();
				return;
			} else {
				score -= 10;
			}
		}
	}
}

function collides(x1, y1, w1, h1, x2, y2, w2, h2) {
	return x1 < x2 + w2 && x1 + w1 > x2 &&
		y1 < y2 + h2 && y1 + h1 > y2;
}

function movePlayer() {
	if(keydown.space) {
		player.shoot();
	}

	if(keydown.left) {
		player.x -= 2;
	}

	if(keydown.right) {
		player.x += 2;
	}

	if(keydown.up) {
		player.y -= 2;
	}

	if(keydown.down) {
		player.y += 2;
	}

	// Keep player within bounds
	player.x = player.x <= 0 ? 0 : player.x;
	player.x = player.x > (CANVAS_WIDTH - player.width) ? CANVAS_WIDTH - player.width : player.x;
	player.y = player.y <= 0 ? 0 : player.y;
	player.y = player.y > (CANVAS_HEIGHT - player.height) ? CANVAS_HEIGHT - player.height : player.y;
}

function prep() {
	//clearInterval(refreshInterval);
	canvasElement.hide();
	questionDiv.hide();
	loadingDiv.show();
	setTimeout(function(){ loadingDiv.hide(); canvasElement.show(); questionDiv.innerHTML = "Question: " + curQues; questionDiv.show(); }, 2000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}