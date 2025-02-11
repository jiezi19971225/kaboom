kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
	clearColor: [0, 0, 0, 1],
// 	connect: "ws://localhost:7000",
});

loadRoot("/pub/examples/");

loadAseprite("car", "img/car.png", "img/car.json");
loadSprite("steel", "img/steel.png");
loadSprite("grass", "img/grass.png");
loadSprite("jumpy", "img/jumpy.png");
loadSprite("spike", "img/spike.png");
loadSprite("coin", "img/coin.png");

loadSound("coin", "sounds/coin.mp3");

gravity(980);

layers([
	"game",
	"ui",
], "game");

camIgnore([ "ui", ]);

const map = addLevel([
	"                         ",
	"                         ",
	"          ooo            ",
	"     ^+++====+=          ",
	"                         ",
	"                         ",
	"                         ",
	"                         ",
	"               =++===    ",
	"                         ",
	"                    oo   ",
	"        =====      +++ **",
	"==========++===+=^====+++",
], {
	width: 11,
	height: 11,
	pos: vec2(0, 0),
	"+": [
		sprite("steel"),
		area(),
		solid(),
	],
	"=": [
		sprite("grass"),
		area(),
		solid(),
	],
	"^": [
		sprite("jumpy"),
		area(),
		solid(),
		"jumpy",
	],
	"*": [
		sprite("spike"),
		area(),
		body(),
		area(vec2(0, 6), vec2(11, 11)),
		"hurt",
	],
	"o": [
		sprite("coin"),
		area(),
		body(),
		"coin",
	],
});

const player = add([
	sprite("car"),
	area(),
	pos(map.getPos(1, 0)),
	scale(1),
	body({ jumpForce: 320, }),
	origin("center"),
	{
		speed: 160,
	},
]);

// 	sync(player);

player.action(() => {
	camPos(player.pos);
});

// TODO: only touch on bottom edge jumps
player.collides("jumpy", () => {
	player.jump(player.jumpForce * 2);
});

player.collides("hurt", () => {
	respawn();
});

player.collides("coin", (c) => {
	destroy(c);
	play("coin");
	score.value += 1;
	score.text = score.value;
});

keyPress("space", () => {
	if (player.grounded()) {
		player.jump(player.jumpForce);
	}
});

keyDown(["left", "right"], () => {
	if (player.grounded() && player.curAnim() !== "move") {
		player.play("move");
	}
});

keyRelease(["left", "right"], () => {
	if (!keyIsDown("right") && !keyIsDown("left")) {
		player.play("idle");
	}
});

keyDown("left", () => {
	player.flipX(true);
	player.move(-player.speed, 0);
});

keyDown("right", () => {
	player.flipX(false);
	player.move(player.speed, 0);
});

keyDown("up", () => {
	camScale(camScale().add(vec2(dt())));
});

keyDown("down", () => {
	camScale(camScale().sub(vec2(dt())));
});

function respawn() {
	player.pos = vec2(0, 0);
}

player.action(() => {
	if (player.pos.y >= 320) {
		respawn();
	}
});

const score = add([
	text(0),
	pos(12, 12),
	layer("ui"),
	{ value: 0, },
]);
