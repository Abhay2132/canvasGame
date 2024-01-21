import Game from "./game/game.js";

(()=>{
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");
	window.__ctx = ctx
	window.onresize = () => {
		ctx.canvas.width  = window.innerWidth -2;
		ctx.canvas.height = window.innerHeight-5;
	}
	window.onresize();
	const game = new Game(ctx);
	game.start();
	
	document.querySelector("#game-btn")
	.onclick=()=>(game.isRunning = !game.isRunning);
	
	console.log(ctx.getTransform());
})();