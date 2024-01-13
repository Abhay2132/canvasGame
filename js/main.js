import Game from "./lib/game.js";

(()=>{
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");
	
	ctx.canvas.width  = window.innerWidth -2;
	ctx.canvas.height = window.innerHeight-5;
	
	const game = new Game(ctx);
	game.start();
})();