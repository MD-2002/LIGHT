const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = [
    0, 0.5, 0,    // V1.position
    .5, -.5, 0,   // V2.position
    -.5, -.5, 0,  // V3.position
    .5,-.5,0,
    0,.5,0,
    -.5,-.5,0,
    0, .5, 0,    // V1.position
    -.5, -.5, 0, // V2.position
    .5, -.5, 0, //v3
];

const colorData = [
    1, 0, 0,    // V1.color
    0, 1, 0,    // V2.color
    0, 0, 1,    // V3.color
];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor,1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const matrix = mat4.create();
mat4.translate(matrix, matrix, [0, 0, 0]);
mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);

let out=0;
let out2=0;
let out3=0;

function animate() {
    requestAnimationFrame(animate);
    document.onkeydown = function (event) {
        switch (event.key) {
            case `x`: 
            mat4.rotateX(matrix, matrix, Math.PI/20);
                break;
            case `y`: 
            mat4.rotateY(matrix, matrix, Math.PI/20);
                break;
            case `z`:  
            mat4.rotateZ(matrix, matrix, Math.PI/20);
                break;
                case `X`: 
            mat4.rotateX(matrix, matrix, Math.PI/20);
                break;
            case `Y`: 
            mat4.rotateY(matrix, matrix, Math.PI/20);
                break;
            case `Z`:  
            mat4.rotateZ(matrix, matrix, Math.PI/20);
                break;
        }
    }
	
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

animate();
function Z(){
	start*=-1;
}
function Y(){
	start2*=-1;
}
function X(){
	start3*=-1;
}
