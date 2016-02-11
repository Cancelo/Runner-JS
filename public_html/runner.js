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
	salto: 10,
	velX: 0,
	velY: 0,
	estaSaltando: true,
	color: "#7CB342"
};

var obstaculo = {
	x: width,
	y: height - 20,
	width: 100,
	height: 20,
	velX: -5
};

// ENTORNO
var gogogo = false;
var keys = [];
var gravedad = 0.3;
var suelo = 3;
var control = height - player.height - suelo;
var salud = 1;
var nivel = 0;
var c = 1;
var puntuacion = 0;
var bonus = 0;

var entornoColor = "#FF8F00";
var sombra = "#E65100";
var textoColor = "#FFFFFF";

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
	if(player.estaSaltando) {
		bonus = bonus + 1;
		//player.color = "#FFEB3B";	
	}
	else {
		bonus = bonus - 1;
		if(bonus <= 0) {
			bonus = 0;
		}
		//player.color = "#aa00ff";
	}
	puntuacion = puntuacion + 1;
}

function inicio() {
		ctx.fillStyle = textoColor;
		ctx.font = "40px Dosis";
		ctx.fillText("S P A C E  J U M P", 280, 205);
		ctx.font = "15px Dosis";
		ctx.fillText("Pulsa ESPACIO para iniciar el jugar", 320, 245);
}

function gameOver() {
		ctx.font = "40px Dosis";
		ctx.fillText("G A M E  O V E R", 280, 205);
		ctx.font = "15px Dosis";
		ctx.fillText("Pulsa F5 para volver a jugar", 320, 245);
}

function setPuntuacion(nivel, puntuacion, bonus) {
	var total = bonus+puntuacion;

	document.formulario.nivel.value = nivel;
    document.formulario.puntuacion.value = puntuacion;
    document.formulario.bonus.value = bonus;
    document.formulario.total.value = total;

    document.getElementById("nivel").innerHTML = nivel;
    document.getElementById("puntuacion").innerHTML = puntuacion;
    document.getElementById("bonus").innerHTML = bonus;
    document.getElementById("total").innerHTML = total;
    
    document.getElementById("player").style.visibility = '';
    document.getElementById("focus").focus();
}

function barraPuntuacion() {
	ctx.fillStyle = textoColor;
	ctx.font="18px Dosis";
	ctx.fillText("Obstaculos: "+c, 5, 20);
	ctx.fillText("Nivel: "+nivel, 5, 40);	
	ctx.fillText("Bonus: "+bonus, player.x-15, player.y-5);
	ctx.fillText("Puntuación: "+puntuacion, width-150, 20);
}

function update() {

	if(!gogogo) {
		//inicio();

		if(keys[32]) {
			gogogo = true;
		}
	}
	else if(salud <= 0) {
		gameOver();
        setPuntuacion(nivel, puntuacion, bonus);
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
				player.velY = -player.salto;
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
		ctx.fillStyle = "#1B5E20";
		ctx.fillRect(player.x, player.y, 5, player.height);

		ctx.fillStyle = entornoColor;
		ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
		ctx.fillRect(obstaculo.x, obstaculo.y, 5, obstaculo.height);
		ctx.fillRect(0, height-suelo, width, suelo); // Suelo
		//ctx.fillRect(0, 0, width, 30);  // Techo
		// Sombra
		ctx.fillStyle = sombra;
		ctx.fillRect(obstaculo.x, obstaculo.y, 20, obstaculo.height);
		barraPuntuacion();
		
/*
		//-----Control--------
		ctx.fillStyle = "red";
		ctx.font="10px Courier";
		ctx.fillText("Velocidad: "+obstaculo.velX, 5,50);		
		ctx.fillText("Salud: "+salud, 5,60);
		ctx.fillText("x: "+obstaculo.x+" y: "+obstaculo.y+" width: "+obstaculo.width+" height: "+obstaculo.height, 5,70);
*/		
	}
	requestAnimationFrame(update);
}

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});

window.addEventListener("load", update(),true);
