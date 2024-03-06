const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const numSides = 4; // Number of sides in the shape
const radius = 0.5; // Radius of the circle
let vertexData = [0, 0, 0]; // Start with the center of the shape

// Generate the vertices of the octagon
for(let i = 0; i <= numSides; i++) {
    let angle = (Math.PI*2 / numSides) * i;
    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;
    vertexData.push(x, y, 0);
}

vertexData = new Float32Array(vertexData);

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
    gl_FragColor = vec4(1, 0, 0, 1);
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

gl.drawArrays(gl.TRIANGLE_FAN, 0, numSides + 2);