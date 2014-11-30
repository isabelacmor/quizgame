var data = window.localStorage;
var questions = [];
var answers = [];
var curQ = "";
var curA = "";
var qPos = 0;

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var CORRECT_POINTS = 50;
var INCORRECT_POINTS = -15;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star1', 'assets/star1.png');
    game.load.image('star2', 'assets/star2.png');
    game.load.image('star3', 'assets/star3.png');
    game.load.image('star4', 'assets/star4.png');
    game.load.image('star5', 'assets/star5.png');
    game.load.image('star6', 'assets/star6.png');
    game.load.spritesheet('spaceman', 'assets/spaceman.png', 32, 48);
    
    // Load all questions and answers
    for(var i = 0; i < data.length; i++) {
        questions[i] = data.key(i);
        answers[i] = data.getItem(data.key(i));
    }
    
    // Set the initial question and answer
    curQ = questions[0];
    curA = answers[0];
    
    setQuestion();

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function removeAllStars() {    
    while(stars.length != 0){
       stars.getAt(0).destroy();
    }
}

function createAllStars() {
    for (var i = 0; i < answers.length; i++)
    {
        
        //  Create a star inside of the 'stars' group
        var star = stars.create(getRandomInt(0, GAME_WIDTH-50), 0, ('star' + (i+1)));

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        // Keep bouncing for an extended time with random y velocity
        star.body.bounce.set(1);
        star.body.velocity.y = getRandomInt(20, 200);
        // Gives star random bounce value
        //star.body.bounce.y = 0.7 + Math.random() * 0.2;
        
        star.answer = answers[i];
    }   
    
    showAnswerChoices();
}

function showAnswerChoices() {
    var str = "";    
    var choices = [];
    for(var i = 0; i < stars.length; i++) {
        choices[i] = str + "<img class='ans' src='assets/" + stars.getAt(i).key + ".png' /><span class='text' style='padding: 0 10px 0 5px;'>" + stars.getAt(i).answer + "</span>";
    }
    
    document.getElementById("answerChoices").innerHTML = shuffle(choices).join(" ");
}

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'spaceman');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    createAllStars();
    setQuestion();

    //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    
    // Check if last answer so we can end the game
    // Add a new check to load more questions from data
    // (set a current limit to 6 since we only have 6 unique star images)...
    if(curA === undefined || curA === null){
        endGame();
    }

}

function restartGame() {
    qPos = 0;
    curQ = questions[qPos];
    curA = answers[qPos];
    score = 0;
    scoreText.text = 'Score: ' + score;
    
    setQuestion();
    removeAllStars();
    createAllStars();
}

function endGame() {
    setQuestion();
    removeAllStars();
}

function collectStar (player, star) {    
    // Removes the star from the screen
    star.kill();
    
    // Process a correct answer
    if(star.answer === curA) {
        score += CORRECT_POINTS;
        qPos++;
        
        // Shows new question
        curQ = questions[qPos];
        curA = answers[qPos];
        
        // Shows new set of stars (answers)
        removeAllStars();
        createAllStars();
        
        setQuestion();
        
    } else {
        score += INCORRECT_POINTS;   
    }
    
    scoreText.text = 'Score: ' + score;

}

function setQuestion() {
    if(curQ === undefined){
        document.getElementById("question").innerHTML = "You win!";   
    } else {
        document.getElementById("question").innerHTML = "Question: " + curQ;    
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}