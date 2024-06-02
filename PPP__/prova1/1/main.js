const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = new Float32Array([
    -0.5,0.398,
    -0.5,0.2,
    -0.13,0,

    -0.498,0.4,
    -0.12,0.55,
    -0.13,0,

    0.24,0.4,
    -0.12,0.55,
    -0.13,0,

    0.24,0.398,
    0.24,0.19,
    -0.13,0,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;

void main() {
    gl_Position = vec4(position, 1);
    gl_PointSize = 5.0;
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(0, 0, 1, 1);
}
`);
gl.compileShader(fragmentShader);

const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader2, `
void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
}
`);
gl.compileShader(fragmentShader2);

const fragmentShader3 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader3, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);
gl.compileShader(fragmentShader3);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const program2 = gl.createProgram();
gl.attachShader(program2, vertexShader);
gl.attachShader(program2, fragmentShader2);
gl.linkProgram(program2);

const program3 = gl.createProgram();
gl.attachShader(program3, vertexShader);
gl.attachShader(program3, fragmentShader3);
gl.linkProgram(program3);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // bind the buffer
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const positionLocation2 = gl.getAttribLocation(program2, 'position');
gl.enableVertexAttribArray(positionLocation2);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // bind the buffer
gl.vertexAttribPointer(positionLocation2, 2, gl.FLOAT, false, 0, 0);

const positionLocation3 = gl.getAttribLocation(program3, 'position');
gl.enableVertexAttribArray(positionLocation3);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // bind the buffer
gl.vertexAttribPointer(positionLocation3, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, vertexData.length/2);

gl.useProgram(program2);
gl.drawArrays(gl.LINE_LOOP, 0, vertexData.length/2);

gl.useProgram(program3);
gl.drawArrays(gl.POINTS, 0, vertexData.length/2);

