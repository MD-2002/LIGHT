const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

let r = 0.5; 

const vertexData = new Float32Array([
    -r,0,0,
    0,r,0,
    r,0,0
]);

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

const vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader2, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position.x,position.y-0.52,position.z, 1);
}
`);
gl.compileShader(vertexShader2);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);
gl.compileShader(fragmentShader);

const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader2, `
void main() {
    gl_FragColor = vec4(0, 0, 1, 1);
}
`);
gl.compileShader(fragmentShader2);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const program2 = gl.createProgram();
gl.attachShader(program2, vertexShader2);
gl.attachShader(program2, fragmentShader2);
gl.linkProgram(program2);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // bind the buffer
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const positionLocation2 = gl.getAttribLocation(program2, 'position');
gl.enableVertexAttribArray(positionLocation2);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // bind the buffer
gl.vertexAttribPointer(positionLocation2, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, vertexData.length/3);

gl.useProgram(program2);
gl.drawArrays(gl.TRIANGLES, 0, vertexData.length/3);

