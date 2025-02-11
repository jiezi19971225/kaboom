![Kaboom Logo](misc/kaboom.png)

Kaboom.js is a JavaScript library that helps you make games fast and fun!

Check out our official [website](https://kaboomjs.com/)!

(This README talks about kaboom v0.6, which will be released shortly. Code here won't work on previous versions. For old README look at commits before e19134e)

## Examples

```html
<script src="https://kaboomjs.com/lib/0.7.0/kaboom.js"></script>
<script type="module">

// initialize kaboom context
const k = kaboom();

// add a text of size 32 at position (100, 100)
k.add([
    k.text("oh hi", 32),
    k.pos(100, 100),
]);

// or
// k.addText("oh hi", 32, { pos: k.vec2(100, 100) });

</script>
```

You can paste this directly into an `html` file and start playing around!

to make a flappy bird movement you only need 3 lines
```js
// init context
const k = kaboom();

// load a default sprite "mark"
k.loadMark();

// make the player game object
const birdy = k.addSprite("mark", { body: true, });

// press space to jump
k.keyPress("space", () => birdy.jump());
```

examples above are using helper functions (like `addSprite()`, `addText()`) as a syntax sugar for kaboom's powerful composable component system

```js
// add an entity to the scene, with a list of component describing its behavior
const player = k.add([
    // it renders as a sprite
    sprite("mark"),
    // it has a position
    pos(100, 200),
    // it is a physical body which will fall
    body(),
    // you can easily make custom components to encapsulate certain reusable logics
    doubleJump(),
    health(8),
    // or give it tags for controlling grouped behaviors in a faster way
    "player",
    "friendly",
    // custom fields
    {
        dir: vec2(-1, 0),
        dead: false,
        speed: 240,
    },
]);

// custom components are plain functions that return an object
function health(hp) {
    return {
        // comp id
        id: "health",
        // comp dependencies
        require: [],
        // custom behaviors
        hurt(n) {
            hp -= n ?? 1;
            this.trigger("hurt");
            if (hp <= 0) {
                this.trigger("death");
            }
        },
        heal(n) {
            hp += n ?? 1;
            this.trigger("heal");
        },
        hp() {
            return hp;
        },
    };
}

// listen to custom events from a custom component
player.on("hurt", () => { ... });

// decoupled discrete logic
player.collides("enemy", () => player.hurt(1));
```

blocky imperative syntax for describing behaviors
```js
// check fall death
player.action(() => {
    if (player.pos.y >= height()) {
        destroy(player);
        gameOver();
    }
});

// if 'player' collides with any object with tag "enemy", run the callback
player.collides("enemy", () => {
    player.hp -= 1;
});

// all objects with tag "enemy" will move towards 'player' every frame
action("enemy", (e) => {
    e.move(player.pos.sub(e.pos).unit().scale(e.speed));
});

keyPress("w", () => {
    player.move(vec2(0, 100)),
});

```

if you don't feel like using kaboom's abstraction systems, can always use it like p5.js or love2d with stateless immediate mode APIs

```js
const k = kaboom();

// runs every frame
k.action(() => {
    // checks if is pressed last frame only
    if (k.keyIsPressed("space")) {
        doSomeThing();
    }
});

// runs every frame after update
k.render(() => {
    // immediate drawing functions
    k.drawSprite("birdy");
    k.drawText("123abc");
    k.drawRect(100, 300);
});
```

## Usage

### cdn

1. self hosted

```html
<script src="https://kaboomjs.com/lib/0.7.0/kaboom.js"></script>
```

All available version tags can be found in CHANGELOG.md, or Github releases.

Special Version Tags:
- `dev`: current master with the newest unreleased features / fixes, expect breaking changes
- `latest`: latest release

2. third party

kaboom is on npm thus supported by most js lib CDN providers

```html
<script src="https://unpkg.com/kaboom@0.7.0/dist/kaboom.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kaboom@0.7.0/dist/kaboom.js"></script>
```

When imported in the browser, the script will expose a global `kaboom` function to initialize a kaboom context, returning an object containing all the functions

```js
const k = kaboom();

k.add();
k.keyPress(...);
k.scene(...);
```

You can also import all functions to the global namespace by giving a `global` flag

```js
kaboom({
    global: true,
});

add();
keyPress(...);
scene(...);
```

Kaboom also provide ES module and commonJS module exports with `.mjs` and `.cjs`, e.g,

```js
import kaboom from "https://kaboomjs.com/lib/0.7.0/kaboom.mjs";
```

### npm package

```
$ npm install kaboom
```

```ts
// main.ts
import kaboom, { Vec2, GameObj, } from "kaboom";

const k = kaboom();

function spawnBullet(p: Vec2): GameObj {
    return k.add([
        k.pos(p),
        k.sprite("bullet"),
    ]);
}
```

also works with cjs

```js
const kaboom = require("kaboom");
```

## Dev

1. `npm run dev` to watch & build lib
1. go to http://localhost:8000/examples
1. edit examples in `examples/` to test
1. make sure not to break any existing examples

### Misc

- Find bitmap fonts: [Oldschool PC Font](https://int10h.org/oldschool-pc-fonts)
- Featured on [Console 50](https://console.substack.com/p/console-50)
- Shoutout to [Umayr](https://github.com/umayr) for kindly offering the "kaboom" npm package name
