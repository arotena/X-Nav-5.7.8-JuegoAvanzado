// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var miArray = new Array(10);
var monster = {};
var princessesCaught = localStorage.getItem("princessesCaught");
if(princessesCaught == undefined){
	 princessesCaught = 0;
}
var piedras = 0;
var muertes = localStorage.getItem("muertes");
if(muertes == undefined){
	 muertes = 0;
}
var monstruos = new Array(5);
var nmons = 0;
var primeravez = true;
var aux = 0;
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var comparar = function(elemento1, elemento2) {

	if (
		elemento1.x <= (elemento2.x + 60)
		&& elemento2.x <= (elemento1.x + 60)
		&& elemento1.y <= (elemento2.y + 60)
		&& elemento2.y <= (elemento1.y + 60)
	) {
		return true;
	} else {
	return false;
	}
};

// Reset the game when the player catches a princess
var reset = function () {

	localStorage.setItem("princessesCaught", princessesCaught);
	localStorage.setItem("muertes", muertes);

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;


	// Throw the princess somewhere on the screen randomly
	do {
		princess.x = 32 + (Math.random() * (canvas.width - 88));
		princess.y = 32 + (Math.random() * (canvas.height - 98));
	}
	while (comparar(hero, princess))

	//Throw the monster somewhere on the screen randomly

	nmons = parseInt(princessesCaught/10);
	if(nmons>5){
		nmons = 5;
	}
	velocidad = nmons;
	for (i=0;i<nmons;i++){
		var monster = {
			speed: velocidad
		};
		monstruos[i]= monster;
		do {
			monstruos[i].x = 32 + (Math.random() * (canvas.width - 88));
			monstruos[i].y = 32 + (Math.random() * (canvas.height - 98));
			var n  = i-1;
			var comp = false;
			while(n >= 0){
				comp = comparar(monstruos[n],monstruos[i]);
				if (comp) {
					break;
				}
				--n;
			}
		}
		while (
			comparar(hero,monstruos[i])
			|| comparar(monstruos[i],princess)
			|| comp
		)
	}


	//stone
	piedras = parseInt(princessesCaught/5);
	if(piedras>10){
		piedras = 10;
	}
	for (i=0;i<piedras;i++){
		var stone = {};
		miArray[i]= stone;
		do {
			miArray[i].x = 32 + (Math.random() * (canvas.width - 88));
			miArray[i].y = 32 + (Math.random() * (canvas.height - 98));
			var numero  = i-1;
			var comparacion = false;
			var monsvspie = false;
			for(z = 0; z < nmons; z++ ){
				monsvspie = comparar (miArray[i],monstruos[z]);
				if (monsvspie) {
					break;
				}
			}
			if(monsvspie == false){
				while(numero >= 0){
					comparacion = comparar(miArray[numero],miArray[i]);
					if (comparacion) {
						break;
					}
					--numero;
				}
			}

		}
		while (
			comparar(hero,miArray[i])
			|| comparar(miArray[i],princess)
			|| comparacion || monsvspie
		)
	}
};

var moverarriba = function (element){
	for(i=0;i<piedras;i++){
		if(
			!(element.y >= miArray[i].y + 20
			|| element.y <= miArray[i].y -15
			|| element.x >= miArray[i].x + 20
			|| element.x <= miArray[i].x - 20)
		){
			return false;
		}
	}
	return true;
};

var moverabajo = function (element){
	for(i=0;i<piedras;i++){
		if(
			!(element.y <= miArray[i].y - 20
			|| element.y >= miArray[i].y +15
			|| element.x >= miArray[i].x + 20
			|| element.x <= miArray[i].x - 20)
		){
			return false;
		}
	}
	return true;
};

var moverizquierda = function (element){
	for(i=0;i<piedras;i++){
		if(
			!(element.y >= miArray[i].y + 20
			|| element.y <= miArray[i].y -20
			|| element.x >= miArray[i].x + 20
			|| element.x <= miArray[i].x - 15)
		){
			return false;
		}
	}
	return true;
};

var moverderecha = function (element){
	for(i=0;i<piedras;i++){
		if(
			!(element.y >= miArray[i].y + 20
			|| element.y <= miArray[i].y -20
			|| element.x >= miArray[i].x + 15
			|| element.x <= miArray[i].x - 20)
		){
			return false;
		}
	}
	return true;
};


// Update game objects
var update = function (modifier) {

	if (38 in keysDown && hero.y>25 && moverarriba(hero)){ // Player holding up
		hero.y -= hero.speed * modifier;
			for(i=0;i<nmons;i++){
				if(moverarriba(monstruos[i]) && monstruos[i].y>45){
					monstruos[i].y -= monstruos[i].speed * Math.random();
				}
			}
	}
	if (40 in keysDown && hero.y<(canvas.height-65) && moverabajo(hero)) { // Player holding down
		hero.y += hero.speed * modifier;
		for(i=0;i<nmons;i++){
			if(moverabajo(monstruos[i]) && monstruos[i].y<(canvas.height-85)){
				monstruos[i].y += monstruos[i].speed * Math.random();
			}
		}
	}
	if (37 in keysDown && hero.x>25 && moverizquierda(hero)) { // Player holding left
		hero.x -= hero.speed * modifier;
		for(i=0;i<nmons;i++){
			if(moverizquierda(monstruos[i]) && monstruos[i].x>45){
				monstruos[i].x -= monstruos[i].speed * Math.random();
			}
		}
	}
	if (39 in keysDown && hero.x<(canvas.width-55) && moverderecha(hero)) { // Player holding right
		hero.x += hero.speed * modifier;
		for(i=0;i<nmons;i++){
			if(moverderecha(monstruos[i]) && monstruos[i].x<(canvas.width-75)){
				monstruos[i].x += monstruos[i].speed * Math.random();
			}
		}
	}

	// Are the hero and the princess touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}
	for (var i = 0; i < nmons; i++){

		if (
			hero.x <= (monstruos[i].x + 16)
			&& monstruos[i].x <= (hero.x + 16)
			&& hero.y <= (monstruos[i].y + 16)
			&& monstruos[i].y <= (hero.y + 32)
		) {
			++muertes;
			reset();
		}
	}

};

// Draw everything
var render = function () {
	if(muertes >= 5){
		if(primeravez == true){
		 	aux = princessesCaught;
			primeravez = false;
		}
		princessesCaught = aux;
		muertes = 5;
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}
		localStorage.setItem("princessesCaught", 0);
		localStorage.setItem("muertes", 0);
		ctx.fillText("GAME OVER ",180,200);
	}else{

		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (heroReady) {
			ctx.drawImage(heroImage, hero.x, hero.y);
		}

		if (princessReady) {
			ctx.drawImage(princessImage, princess.x, princess.y);
		}

		for (var i=0;i < nmons; i++){
			if (monsterReady) {
				ctx.drawImage(monsterImage, monstruos[i].x, monstruos[i].y);
			}
		}
		for (var i = 0; i < piedras; i++) {
			if (stoneReady) {
				ctx.drawImage(stoneImage, miArray[i].x, miArray[i].y);
			}
		}
	}




	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Deaths: " + muertes,60,60);

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();
	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
