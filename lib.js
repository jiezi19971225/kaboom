// --------------------------------
// Application Lifecycle & Input

const _app = {
	keyStates: {},
	time: 0.0,
	dt: 0.0,
	keyMap: {
		"ArrowLeft": "left",
		"ArrowRight": "right",
		"ArrowUp": "up",
		"ArrowDown": "down",
	},
};

const _canvas = document.querySelector("#game");
const _gl = _canvas.getContext("webgl");

document.onkeydown = ((e) => {
	_app.keyStates[_app.keyMap[e.key] || e.key] = "pressed";
});

document.onkeyup = ((e) => {
	_app.keyStates[_app.keyMap[e.key] || e.key] = "released";
});

function run(f) {

	_gfxInit();

	const frame = ((t) => {

		_app.dt = t / 1000 - _app.time;
		_app.time += _app.dt;

		_frameStart();
		f();
		_frameEnd();

		for (const k in _app.keyStates) {
			if (_app.keyStates[k] === "pressed") {
				_app.keyStates[k] = "down";
			}
			if (_app.keyStates[k] === "released") {
				_app.keyStates[k] = "idle";
			}
		}

		requestAnimationFrame(frame);

	});

	requestAnimationFrame(frame);

}

function keyPressed(k) {
	return _app.keyStates[k] === "pressed";
}

function keyDown(k) {
	return _app.keyStates[k] === "pressed" || _app.keyStates[k] === "down";
}

function dt() {
	return _app.dt;
}

function time() {
	return _app.time;
}

// --------------------------------
// Rendering

const _gfx = {
	sprites: {},
};

const _defaultVert = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;
varying vec2 v_uv;
varying vec4 v_color;
void main() {
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const _defaultFrag = `
precision mediump float;
varying vec2 v_uv;
varying vec4 v_color;
uniform sampler2D u_tex;
void main() {
	gl_FragColor = v_color * texture2D(u_tex, v_uv);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;

function _makeDynMesh(vcount, icount) {

	const vbuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
	_gl.bufferData(_gl.ARRAY_BUFFER, vcount * 32, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

	const ibuf = _gl.createBuffer();

	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
	_gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, icount * 2, _gl.DYNAMIC_DRAW);
	_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

	let vqueue = [];
	let iqueue = [];
	let count = 0;

	return {

		vbuf: vbuf,
		ibuf: ibuf,
		vqueue: vqueue,
		iqueue: vqueue,

		push(verts, indices) {
			// TODO: overflow
			indices = indices.map((i) => {
				return i + vqueue.length / 8;
			});
			vqueue = vqueue.concat(verts);
			iqueue = iqueue.concat(indices);
		},

		flush() {

			_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
			_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, new Float32Array(vqueue));
			_gl.bindBuffer(_gl.ARRAY_BUFFER, null);

			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
			_gl.bufferSubData(_gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(iqueue));
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);

			count = iqueue.length;

			iqueue = [];
			vqueue = [];

		},

		bind() {
			_gl.bindBuffer(_gl.ARRAY_BUFFER, vbuf);
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ibuf);
		},

		unbind() {
			_gl.bindBuffer(_gl.ARRAY_BUFFER, null);
			_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
		},

		count() {
			return count;
		},

	};

}

function _gfxInit() {

	_gl.clearColor(0.0, 0.0, 0.0, 1.0);

	_gfx.mesh = _makeDynMesh(65536, 65536);
	_gfx.prog = _makeProgram(_defaultVert, _defaultFrag);
	_gfx.defTex = _makeTex(new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1));

}

function _flush() {

	_gfx.mesh.flush();

	if (!_gfx.curTex) {
		return;
	}

	_gfx.mesh.bind();
	_gfx.prog.bind();
	_gfx.curTex.bind();

	_gl.vertexAttribPointer(0, 2, _gl.FLOAT, false, 32, 0);
	_gl.enableVertexAttribArray(0);
	_gl.vertexAttribPointer(1, 2, _gl.FLOAT, false, 32, 8);
	_gl.enableVertexAttribArray(1);
	_gl.vertexAttribPointer(2, 4, _gl.FLOAT, false, 32, 16);
	_gl.enableVertexAttribArray(2);

	_gl.drawElements(_gl.TRIANGLES, _gfx.mesh.count(), _gl.UNSIGNED_SHORT, 0);

	_gfx.prog.unbind();
	_gfx.mesh.unbind();
	_gfx.curTex = undefined;

}

function _frameStart() {
	_gl.clear(_gl.COLOR_BUFFER_BIT);
}

function _frameEnd() {
	_flush();
}

function _makeTex(data) {

	const id = _gl.createTexture();

	_gl.bindTexture(_gl.TEXTURE_2D, id);
	_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, data);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
	_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
	_gl.bindTexture(_gl.TEXTURE_2D, null);

	return {
		id: id,
		width: data.width,
		height: data.height,
		bind() {
			_gl.bindTexture(_gl.TEXTURE_2D, id);
		},
		unbind() {
			_gl.bindTexture(_gl.TEXTURE_2D, null);
		},
	};

}

function _makeProgram(vertSrc, fragSrc) {

	const vertShader = _gl.createShader(_gl.VERTEX_SHADER);

	_gl.shaderSource(vertShader, vertSrc);
	_gl.compileShader(vertShader);

	var msg = _gl.getShaderInfoLog(vertShader);

	if (msg) {
		console.warn(msg);
	}

	const fragShader = _gl.createShader(_gl.FRAGMENT_SHADER);

	_gl.shaderSource(fragShader, fragSrc);
	_gl.compileShader(fragShader);

	var msg = _gl.getShaderInfoLog(fragShader);

	if (msg) {
		console.warn(msg);
	}

	const id = _gl.createProgram();

	_gl.attachShader(id, vertShader);
	_gl.attachShader(id, fragShader);

	_gl.bindAttribLocation(id, 0, "a_pos");
	_gl.bindAttribLocation(id, 1, "a_uv");
	_gl.bindAttribLocation(id, 2, "a_color");

	_gl.linkProgram(id);

	var msg = _gl.getProgramInfoLog(id);

	if (msg) {
		console.warn(msg);
	}

	return {

		id: id,

		bind() {
			_gl.useProgram(id);
		},

		unbind() {
			_gl.useProgram(null);
		},

		sendFloat(name, val) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform1f(loc, val);
		},

		sendVec2(name, x, y) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform2f(loc, x, y);
		},

		sendVec3(name, x, y, z) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform3f(loc, x, y, z);
		},

		sendVec4(name, x, y, z, w) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniform4f(loc, x, y, z, w);
		},

		sendMat4(name, m) {
			const loc = _gl.getUniformLocation(id, name);
			_gl.uniformMatrix4fv(loc, false, new Float32Array(m));
		},

	};

}

function loadSprite(id, src, conf) {

	if (typeof(src) === "string") {
		const img = new Image();
		img.src = src;
		img.onload = (() => {
			loadSprite(id, img, conf);
		});
		return;
	}

	_gfx.sprites[id] = {
		tex: _makeTex(src),
		conf: conf || {
			frames: [
				quad(0, 0, 1, 1),
			],
			anims: {},
		},
	};

}

function sprite(id, pos, frame) {

	const spr = _gfx.sprites[id];

	if (!spr) {
		console.warn(`sprite not found: ${id}`);
		return;
	}

	if (_gfx.curTex != spr.tex) {
		_flush();
		_gfx.curTex = spr.tex;
	}

	const w = spr.tex.width / _canvas.width;
	const h = spr.tex.height / _canvas.height;
	const x = pos.x / _canvas.width;
	const y = pos.y / _canvas.height;

	_gfx.mesh.push([
		// pos  // uv     // color
		-w + x, -h + y, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		-w + x,  h + y, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
		 w + x,  h + y, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0,
		 w + x, -h + y, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
	], [ 0, 1, 2, 0, 2, 3, ]);

}

// --------------------------------
// Audio Playback

const _audio = {
	clips: {},
};

function play(id) {
	// ...
}

// --------------------------------
// Math Utils

function vec2(x, y) {
	return {
		x: x,
		y: y,
	};
}

function quad(x, y, w, h) {
	return {
		x: x,
		y: y,
		w: w,
		h: h,
	};
}

