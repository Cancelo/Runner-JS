// BUCLE
(function() {
	var requestAnimationFrame = window.requestAnimation || 
	window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || 
	window.msRequestAnimationFrame;
	window.requestAnimatioFrame = requestAnimationFrame;
}) ();

// CANVAS
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 800;
var height = 400;

canvas.width = width;
canvas.height = height;

// PLAYER
var player = {
	x: width/6,
	y: height - 100,
	width: 20,
	height: 20,
	salto: 5,
	velX: 0,
	velY: 0,
	estaSaltando: true,
	color: "#88ff66"
};

var obstaculo = {
	x: width,
	y: height - 20,
	width: 100,
	height: 20,
	velX: -5
};

// ENTORNO
var keys = [];
var gravedad = 0.3;
var suelo = 3;
var control = height - player.height - suelo;
var salud = 1;
var nivel = 0;
var c = 1;
var puntuacion = 0;
var bonus = 0;

function creaObstaculo(nivel) {
	var rnd = (Math.floor(Math.random() * (100 - 20))) + 20;
	obstaculo.x = canvas.width + rnd + (-obstaculo.velX);
	obstaculo.y = canvas.height - rnd;
	obstaculo.width = ((-1/4)*obstaculo.velX) * rnd;
	obstaculo.height = 130 - rnd;
	obstaculo.velX = -5 - (nivel/2);

	console.log("Random["+rnd+"] x: "+obstaculo.x+" y: "+obstaculo.y+" width: "+obstaculo.width+" height: "+obstaculo.height);
}

function colision() {
	if(player.x + player.width < obstaculo.x) {
		return false;
	}
	if(player.y + player.height < obstaculo.y) {
		return false;
	}
	if(player.x > obstaculo.x + obstaculo.width) {
		return false;
	}
	if(player.y > obstaculo.y + obstaculo.height) {
		return false;
	}
	return true;
}

function bonusPuntuacion() {
	if(keys[32]) {
		bonus = bonus + 2;
		player.color = "#FFEB3B";
	}
	else {
		bonus = bonus - 1;
		if(bonus <= 0) {
			bonus = 0;
		}
		player.color = "#88ff66";
	}

	puntuacion = puntuacion + 1;
}

function update() {

	if(salud <= 0) {
		//alert("- GAME OVER -\nTu puntuaciÃ³n: "+puntuacion);

		//ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#9966EE";
		ctx.fillRect(0,0,width,height);
		ctx.fillStyle = "white";
		ctx.font="12px Dosis";
		ctx.fillText("Nivel: "+nivel, 5,20);
		ctx.fillText("Obstaculos: "+c, 60,20);
		ctx.fillText("Bonus: "+bonus, 140,20);		
		ctx.fillText("PuntuaciÃ³n: "+puntuacion, width-100, 20);

		ctx.font = "40px Dosis";
		ctx.fillText("G A M E  O V E R", 280, 205);
		ctx.font = "15px Dosis";
		ctx.fillText("Pulsa F5 para volver a jugar", 320, 245);
	}
	else {
		
		bonusPuntuacion();

		if(obstaculo.x + obstaculo.width < 0) {
			c++;
			nivel = Math.floor(c/5); // Cada 5 obstaculos superados aumenta un nivel
			creaObstaculo(nivel);
		}

		if(keys[32]) {
			if(!player.estaSaltando) {
				player.estaSaltando = true;
				player.velY = -player.salto*2;
			}
		}

		player.velY += gravedad;
		player.y += player.velY;

		obstaculo.x += obstaculo.velX;

		if(player.y >= control) {
			player.y = control;
			player.estaSaltando = false;
		}

		if(colision()) {
			console.log("Colision en x: "+player.x+" y: "+player.y);
			salud--;
		}

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = player.color;
		ctx.fillRect(player.x, player.y, player.width, player.height);
		ctx.fillStyle = "#9966EE";
		ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
		ctx.fillRect(0, height-suelo, width, suelo);
		ctx.fillRect(0, 0, width, 30);
		ctx.fillStyle = "white";
		ctx.font="12px Dosis";
		ctx.fillText("Nivel: "+nivel, 5,20);
		ctx.fillText("Obstaculos: "+c, 60,20);
		ctx.fillText("Bonus: "+bonus, 140,20);
		ctx.fillText("PuntuaciÃ³n: "+puntuacion, width-100, 20);

		//-------------
		ctx.fillStyle = "red";
		ctx.font="10px Courier";
		ctx.fillText("Velocidad: "+obstaculo.velX, 5,50);		
		ctx.fillText("Salud: "+salud, 5,60);
		ctx.fillText("y: "+obstaculo.y+" width: "+obstaculo.width+" height: "+obstaculo.height, 5,70);

		requestAnimationFrame(update);
	}	
}

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});

window.addEventListener("load", function() {
	update();
});


