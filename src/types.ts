declare function kaboom(conf?: KaboomConf): KaboomCtx;

type KaboomCtx = {
	burp(),
	// assets
	loadRoot(path?: string): string,
	loadSprite(
		id: string,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	): Promise<SpriteData>,
	loadSound(
		id: string,
		src: string,
	): Promise<SoundData>,
	loadFont(
		id: string,
		src: string,
		gw: number,
		gh: number,
		chars?: string,
	): Promise<FontData>,
	loadShader(
		name: string,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	): Promise<ShaderData>,
	addLoader<T>(l: Promise<T>),
	// game
	width(): number,
	height(): number,
	center(): Vec2,
	dt(): number,
	time(): number,
	screenshot(): string,
	focused(): boolean,
	focus(),
	ready(cb: () => void),
	isTouch(): boolean,
	// scene / obj
	add<T extends Comp>(comps: ReadonlyArray<T>): MergeComps<T> & GameObj,
	readd(obj: GameObj): GameObj,
	destroy(obj: GameObj),
	destroyAll(tag: string),
	get(tag?: string): GameObj[],
	every<T>(t: string, f: (obj: GameObj) => T): T[],
	every<T>(f: (obj: GameObj) => T): T[],
	revery<T>(t: string, f: (obj: GameObj) => T): T[],
	revery<T>(f: (obj: GameObj) => T): T[],
	layers(list: string[], def?: string),
	on(event: string, tag: string, cb: (obj: GameObj) => void): EventCanceller,
	action(tag: string, cb: (obj: GameObj) => void): EventCanceller,
	action(cb: () => void): EventCanceller,
	render(tag: string, cb: (obj: GameObj) => void): EventCanceller,
	render(cb: () => void): EventCanceller,
	collides(
		t1: string,
		t2: string,
		f: (a: GameObj, b: GameObj) => void,
	): EventCanceller,
	overlaps(
		t1: string,
		t2: string,
		f: (a: GameObj, b: GameObj) => void,
	): EventCanceller,
	clicks(
		tag: string,
		f: (a: GameObj) => void,
	): EventCanceller,
	camPos(p: Vec2): Vec2,
	camScale(p: Vec2): Vec2,
	camRot(a: number): number,
	camShake(n: number),
	camIgnore(layers: string[]),
	gravity(g: number): number,
	// net
	recv(ty: string, handler: MsgHandler),
	send(ty: string, data: any),
	// comps
	pos(x: number, y: number): PosComp,
	pos(xy: number): PosComp,
	pos(p: Vec2): PosComp,
	pos(): PosComp,
	scale(x: number, y: number): ScaleComp,
	scale(xy: number): ScaleComp,
	scale(p: Vec2): ScaleComp,
	scale(): ScaleComp,
	rotate(a: number): RotateComp,
	color(r: number, g: number, b: number, a?: number): ColorComp,
	color(c: Color): ColorComp,
	color(): ColorComp,
	origin(o: Origin | Vec2): OriginComp,
	layer(l: string): LayerComp,
	area(p1: Vec2, p2: Vec2): AreaComp,
	sprite(id: string, conf?: SpriteCompConf): SpriteComp,
	text(t: string, size?: number, conf?: TextCompConf): TextComp,
	rect(w: number, h: number): RectComp,
	solid(): SolidComp,
	body(conf?: BodyCompConf): BodyComp,
	shader(id: string): ShaderComp,
	// inputs
	cursor(c?: string),
	mousePos(layer?: string): Vec2,
	mouseDeltaPos(): Vec2,
	keyDown(k: string, f: () => void): EventCanceller,
	keyPress(k: string, f: () => void): EventCanceller,
	keyPressRep(k: string, f: () => void): EventCanceller,
	keyRelease(k: string, f: () => void): EventCanceller,
	charInput(f: (ch: string) => void): EventCanceller,
	mouseDown(f: (pos: Vec2) => void): EventCanceller,
	mouseClick(f: (pos: Vec2) => void): EventCanceller,
	mouseRelease(f: (pos: Vec2) => void): EventCanceller,
	mouseMove(f: (pos: Vec2) => void): EventCanceller,
	touchStart(f: (id: TouchID, pos: Vec2) => void): EventCanceller,
	touchMove(f: (id: TouchID, pos: Vec2) => void): EventCanceller,
	touchEnd(f: (id: TouchID, pos: Vec2) => void): EventCanceller,
	keyIsDown(k: string): boolean,
	keyIsPressed(k: string): boolean,
	keyIsPressedRep(k: string): boolean,
	keyIsReleased(k: string): boolean,
	mouseIsDown(): boolean,
	mouseIsClicked(): boolean,
	mouseIsReleased(): boolean,
	mouseIsMoved(): boolean,
	// timers
	loop(t: number, f: () => void): EventCanceller,
	wait(t: number, f?: () => void): Promise<void>,
	// audio
	play(id: string, conf?: AudioPlayConf): AudioPlay,
	volume(v?: number): number,
	audioCtx(): AudioContext,
	// math
	makeRng(seed: number): RNG,
	rand(): number,
	rand<T extends RNGValue>(n: T): T,
	rand<T extends RNGValue>(a: T, b: T): T,
	randSeed(seed: number): number,
	vec2(x: number, y: number): Vec2,
	vec2(p: Vec2): Vec2,
	vec2(xy: number): Vec2,
	vec2(): Vec2,
	rgb(r: number, g: number, b: number): Color,
	rgba(r: number, g: number, b: number, a: number): Color,
	quad(x: number, y: number, w: number, h: number): Quad,
	choose<T>(lst: T[]): T,
	chance(p: number): boolean,
	lerp(from: number, to: number, t: number): number,
	map(
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	): number,
	mapc(
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	): number,
	wave(lo: number, hi: number, t: number): number,
	deg2rad(deg: number): number,
	rad2deg(rad: number): number,
	// draw
	drawSprite(id: string | SpriteData, conf?: DrawSpriteConf),
	// TODO: conf type
	drawText(txt: string, conf?: {}),
	drawRect(pos: Vec2, w: number, h: number, conf?: DrawRectConf),
	drawRectStroke(pos: Vec2, w: number, h: number, conf?: DrawRectStrokeConf),
	drawLine(p1: Vec2, p2: Vec2, conf?: DrawLineConf),
	drawTri(p1: Vec2, p2: Vec2, p3: Vec2, conf?: DrawTriConf),
	// scene
	scene(id: SceneID, def: SceneDef),
	go(id: SceneID, ...args),
	// storage
	getData(key: string, def?: any): any,
	setData(key: string, data: any),
	// plugin
	plug<T>(plugin: KaboomPlugin<T>): MergeObj<T> & KaboomCtx,
	// dbg
	debug: Debug,
	// char sets
	ASCII_CHARS: string,
	CP437_CHARS: string,
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type Defined<T> = T extends any ? Pick<T, { [K in keyof T]-?: T[K] extends undefined ? never : K }[keyof T]> : never;
type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type MergeObj<T> = Expand<UnionToIntersection<Defined<T>>>;
type MergeComps<T> = Omit<MergeObj<T>, keyof Comp>;

type SceneID = string;
type SceneDef = (...args) => void;
type TouchID = number;

// TODO: enum
type ScaleMode =
	"stretch"
	| "letterbox"
	| "none"
	;

type EventCanceller = () => void;

type KaboomConf = {
	width?: number,
	height?: number,
	scale?: number,
	scaleMode?: ScaleMode,
	fullscreen?: boolean,
	debug?: boolean,
	crisp?: boolean,
	canvas?: HTMLCanvasElement,
	root?: HTMLElement,
	clearColor?: number[],
	inspectColor?: number[],
	texFilter?: TexFilter,
	logMax?: number,
	connect?: string,
	touchToMouse?: boolean,
	global?: boolean,
	plugins?: KaboomPlugin<any>[],
};

interface GameObj {
	_id: number | null,
	hidden: boolean;
	paused: boolean;
	exists(): boolean;
	is(tag: string | string[]): boolean;
	use(comp: Comp);
	action(cb: () => void): EventCanceller;
	on(ev: string, cb: () => void): EventCanceller;
	trigger(ev: string, ...args);
	rmTag(t: string);
	destroy();
	c(id: string): Comp;
	[custom: string]: any;
};

type SpriteAnim = {
	from: number,
	to: number,
};

type KaboomPlugin<T> = (k: KaboomCtx) => T;

type SpriteLoadConf = {
	sliceX?: number,
	sliceY?: number,
	gridWidth?: number,
	gridHeight?: number,
	anims?: Record<string, SpriteAnim>,
};

type SpriteLoadSrc = string | GfxTextureData;

type SpriteData = {
	tex: GfxTexture,
	frames: Quad[],
	anims: Record<string, SpriteAnim>,
};

type SoundData = AudioBuffer;
type FontData = GfxFont;
type ShaderData = GfxProgram;

type AudioPlayConf = {
	loop?: boolean,
	volume?: number,
	speed?: number,
	detune?: number,
	seek?: number,
};

type AudioPlay = {
	play(seek?: number),
	stop(),
	pause(),
	paused(): boolean,
	stopped(): boolean,
	speed(s?: number): number,
	detune(d?: number): number,
	volume(v?: number): number,
	time(): number,
	duration(): number,
	loop(),
	unloop(),
};

type GfxProgram = {
	bind(),
	unbind(),
	bindAttribs(),
	send(uniform: Uniform),
}

type GfxTexture = {
	width: number,
	height: number,
	bind(),
	unbind(),
};

type GfxTextureData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

type GfxFont = {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	qw: number,
	qh: number,
};

type Vertex = {
	pos: Vec3,
	uv: Vec2,
	color: Color,
};

type TexFilter = "nearest" | "linear";

type RenderProps = {
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	origin?: Origin | Vec2,
};

type DrawQuadConf = RenderProps & {
	flipX?: boolean,
	flipY?: boolean,
	width?: number,
	height?: number,
	z?: number,
	tex?: GfxTexture,
	quad?: Quad,
	prog?: GfxProgram,
	uniform?: Uniform,
};

type DrawTextureConf = RenderProps & {
	flipX?: boolean,
	flipY?: boolean,
	width?: number,
	height?: number,
	tiled?: boolean,
	quad?: Quad,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
};

type DrawRectStrokeConf = RenderProps & {
	width?: number,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
};

type DrawRectConf = RenderProps & {
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
};

type DrawLineConf = RenderProps & {
	width?: number,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
};

type DrawTriConf = RenderProps & {
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
};

type DrawTextConf = RenderProps & {
	size?: number,
	width?: number,
	z?: number,
	prog?: GfxProgram,
};

type FormattedChar = {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	color: Color,
	origin: string,
	z: number,
};

type FormattedText = {
	width: number,
	height: number,
	chars: FormattedChar[],
};

// TODO: enum
type Origin =
	"topleft"
	| "top"
	| "topright"
	| "left"
	| "center"
	| "right"
	| "botleft"
	| "bot"
	| "botright"
	;

type DrawSpriteConf = RenderProps & {
	frame?: number,
	width?: number,
	height?: number,
	tiled?: boolean,
	flipX?: boolean,
	flipY?: boolean,
	quad?: Quad,
	prog?: ShaderData,
	uniform?: Uniform,
	z?: number,
};

type Vec2 = {
	x: number,
	y: number,
	clone(): Vec2,
	add(p: Vec2): Vec2,
	sub(p: Vec2): Vec2,
	scale(...args): Vec2,
	dot(p: Vec2): number,
	dist(p: Vec2): number,
	len(): number,
	unit(): Vec2,
	normal(): Vec2,
	angle(p: Vec2): number,
	lerp(p: Vec2, t: number): Vec2,
	toFixed(n: number): Vec2,
	eq(p: Vec2): boolean,
	str(): string,
};

type Vec3 = {
	x: number,
	y: number,
	z: number,
	xy(): Vec2,
};

type Vec4 = {
	x: number,
	y: number,
	z: number,
	w: number,
};

type Mat4 = {
	m: number[],
	clone(): Mat4,
	mult(m: Mat4): Mat4,
	multVec4(m: Vec4): Vec4,
	multVec3(m: Vec3): Vec3,
	multVec2(m: Vec2): Vec2,
	scale(s: Vec2): Mat4,
	translate(p: Vec2): Mat4,
	rotateX(a: number): Mat4,
	rotateY(a: number): Mat4,
	rotateZ(a: number): Mat4,
	invert(): Mat4,
};

type Color = {
	r: number,
	g: number,
	b: number,
	a: number,
	clone(): Color,
	lighten(n: number): Color,
	darken(n: number): Color,
	invert(): Color,
	isDark(p?: number): boolean,
	isLight(p?: number): boolean,
	eq(c: Color): boolean,
};

type Quad = {
	x: number,
	y: number,
	w: number,
	h: number,
	scale(q: Quad): Quad,
	clone(): Quad,
	eq(q: Quad): boolean,
};

type RNGValue =
	number
	| Vec2
	| Color
	;

type RNG = {
	seed: number,
	gen(): number,
	gen<T extends RNGValue>(n: T): T,
	gen<T extends RNGValue>(a: T, b: T): T,
};

type Rect = {
	p1: Vec2,
	p2: Vec2,
};

type Line = {
	p1: Vec2,
	p2: Vec2,
};

type ClientID = number;
type MsgHandler = (id: ClientID, data: any) => void;

interface Comp {
	id?: CompID;
	require?: CompID[];
	add?: AddEvent;
	update?: UpdateEvent;
	draw?: DrawEvent;
	destroy?: DestroyEvent;
	inspect?: InspectEvent;
	[custom: string]: any;
};

type CompBuilder = any;
// TODO: doesn't work
// type CompBuilder = (...args) => Comp;
type GameObjID = number;
type CompID = string;
type AddEvent = () => void;
type DrawEvent = () => void;
type UpdateEvent = () => void;
type DestroyEvent = () => void;
type InspectEvent = () => any;

type PosCompInspect = {
	pos: string,
};

interface PosComp extends Comp {
	pos: Vec2;
	move(x: number, y: number);
	move(p: Vec2);
	screenPos(): Vec2;
	inspect(): PosCompInspect;
};

interface ScaleComp extends Comp {
	scale: Vec2;
};

interface RotateComp extends Comp {
	angle: number;
};

interface ColorComp extends Comp {
	color: Color;
};

interface OriginComp extends Comp {
	origin: Origin | Vec2;
};

type LayerCompInspect = {
	layer: string,
};

interface LayerComp extends Comp {
	layer: string;
	inspect(): LayerCompInspect;
};

type RectSide =
	"top"
	| "bottom"
	| "left"
	| "right"
	;

type PushOut = {
	obj: GameObj,
	side: RectSide,
	dis: number,
}

interface AreaComp extends Comp {
	area: Rect;
	areaWidth(): number,
	areaHeight(): number,
	isClicked(): boolean,
	isHovered(): boolean,
	isCollided(o: GameObj): boolean,
	isOverlapped(o: GameObj): boolean,
	clicks(f: () => void),
	hovers(f: () => void),
	collides(tag: string, f: (o: GameObj) => void),
	overlaps(tag: string, f: (o: GameObj) => void),
	hasPt(p: Vec2): boolean,
	pushOut(obj: GameObj): PushOut | null,
	pushOutAll(): PushOut[],
	_worldArea(): Rect;
	_checkCollisions(tag: string, f: (obj: GameObj) => void): void;
	_checkOverlaps(tag: string, f: (obj: GameObj) => void): void;
};

type SpriteCompConf = {
	quad?: Quad,
	frame?: number,
	animSpeed?: number,
	tiled?: boolean,
	width?: number,
	height?: number,
	flipX?: boolean,
	flipY?: boolean,
};

type SpriteCurAnim = {
	name: string,
	loop: boolean,
	timer: number,
};

interface SpriteComp extends Comp {
	draw: DrawEvent;
	update: UpdateEvent;
	width: number;
	height: number;
	animSpeed: number;
	frame: number;
	quad: Quad;
	play(anim: string, loop?: boolean);
	stop();
	changeSprite(id: string);
	numFrames(): number;
	curAnim(): string;
	flipX(b: boolean);
	flipY(b: boolean);
	inspect(): SpriteCompInspect;
};

type SpriteCompInspect = {
	curAnim?: string,
};

interface TextComp extends Comp {
	draw: DrawEvent;
	text: string;
	textSize: number;
	font: string;
	width: number;
	height: number;
};

type TextCompConf = {
	area?: boolean,
	font?: string,
	width?: number,
};

interface RectComp extends Comp {
	draw: DrawEvent;
	width: number;
	height: number;
};

type Debug = {
	paused: boolean,
	inspect: boolean,
	timeScale: number,
	showLog: boolean,
	fps(): number,
	objCount(): number,
	drawCalls(): number,
	stepFrame(),
	clearLog(),
	log(msg: string),
	error(msg: string),
};

type UniformValue =
	Vec2
	| Vec3
	| Color
	| Mat4
	;

type Uniform = Record<string, UniformValue>;

interface ShaderComp extends Comp {
	uniform: Uniform;
	shader: string;
};

interface BodyComp extends Comp {
	update: UpdateEvent;
	jumpForce: number;
	curPlatform(): GameObj | null;
	grounded(): boolean;
	falling(): boolean;
	jump(f: number);
};

type BodyCompConf = {
	jumpForce?: number,
	maxVel?: number,
};

interface SolidComp extends Comp {
	solid: boolean;
};

type HelperProps = {
	body?: boolean,
	solid?: boolean,
	layer?: string,
	origin?: Origin | Vec2,
	tags?: string[],
    data?: any,
}

type AddSpriteConf = RenderProps & HelperProps & SpriteCompConf;
type AddRectConf = RenderProps & HelperProps;
type AddTextConf = RenderProps & HelperProps & TextCompConf;
