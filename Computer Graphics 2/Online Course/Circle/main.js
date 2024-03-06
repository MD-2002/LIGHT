const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const numSegments = 360; // Number of segments to approximate the circle

const vertexData = new Float32Array((numSegments + 2) * 3);

// Center of the circle
vertexData[0] = 0;
vertexData[1] = 0;
vertexData[2] = 0;

// Points of the circle
for (let i = 0; i <= numSegments; i++) {
    const theta = (i / numSegments) * 2 * Math.PI;
    const x = 0.5 * Math.cos(theta);
    const y = 0.5 * Math.sin(theta);
    vertexData[(i + 1) * 3] = x;
    vertexData[(i + 1) * 3 + 1] = y;
    vertexData[(i + 1) * 3 + 2] = 0;
}

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;

void main() {
    gl_Position = vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(0, 1, 0, 1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
