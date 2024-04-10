const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
    throw new Error('WebGL not supported');
}

var r=0.4;
var vertexData = new Float32Array([
	//front
	r,r,r,
	r,-r,r,
	-r,r,r,
	-r,r,r,
	r,-r,r,
	-r,-r,r,
	
	//back
	r,r,-r,
	r,-r,-r,
	-r,r,-r,
	-r,r,-r,
	r,-r,-r,
	-r,-r,-r,
	
	//top
	r,r,r,
	-r,r,r,
	-r,r,-r,
	r,r,r,
	-r,r,-r,
	r,r,-r,	
	
	//bottom
	r,-r,r,
	-r,-r,r,
	-r,-r,-r,
	r,-r,r,
	-r,-r,-r,
	r,-r,-r,

	//left
	-r,-r,r,
	-r,r,r,
	-r,-r,-r,
	-r,-r,-r,
	-r,r,r,
	-r,r,-r,	
	
	//right
	r,-r,r,
	r,r,r,
	r,-r,-r,
	r,-r,-r,
	r,r,r,
	r,r,-r,	
	]);

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

let colorData = [];
for (let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
        colorData.push(...faceColor);
    }
}

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

//Using mat4

const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
    precision mediump float;
    attribute vec3 pos;
    attribute vec3 color;
    varying vec3 vColor;
    uniform mat4 matrix;     
    
    void main(){
        vColor = color;        
        gl_Position = matrix * vec4(pos, 1.0);
    }
`);
gl.compileShader(vertexShader);

const fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    precision mediump float;
    varying vec3 vColor;
    void main(){
        gl_FragColor = vec4(vColor, 1);
    }
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const posLocation = gl.getAttribLocation(program, 'pos');
const colorLocation = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(posLocation);
gl.enableVertexAttribArray(colorLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

const matrixLocation=gl.getUniformLocation(program, 'matrix');

let start4 = 1;
let start5 = 1;
let start6 = 1;
let matrixA=identityMat4();
let matrixB= Math.PI/4;
let out= 0;
let out2= 0;
let out3= 0;

gl.enable(gl.DEPTH_TEST);

function animate() {
    out+=0.05;
    out2+=0.05;
    out3+=0.05;
    let rotationMatrix = identityMat4();

    if (start6 == -1) {
        rotationMatrix = rotateX(out);
    }
    if (start5 == -1) {
        rotationMatrix = matrixMultiplication(rotateY(out2), rotationMatrix);
    }
    if (start4 == -1) {
        rotationMatrix = matrixMultiplication(rotateZ(out3), rotationMatrix);
    }
    gl.uniformMatrix4fv(matrixLocation, false, rotationMatrix);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    requestAnimationFrame(animate);
}

animate();
function st_2() {
    start6 *= -1;
}

function st_3() {
    
    start5 *= -1;
}

function st_4() {
    start4 *= -1;
}

//-----------------------------------------Matrix function----------------------------------------------// 
function identityMat4(){
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]);
}

function rotateX(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1
    ];
}

function rotateY(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    ];
}

function rotateZ(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function matrixMultiplication(matrixA,matrixB) {
    return[
    matrixA[0]*matrixB[0] + matrixA[1]*matrixB[4] + matrixA[2]*matrixB[8] + matrixA[3]*matrixB[12],
    matrixA[0]*matrixB[1] + matrixA[1]*matrixB[5] + matrixA[2]*matrixB[9] + matrixA[3]*matrixB[13],
    matrixA[0]*matrixB[2] + matrixA[1]*matrixB[6] + matrixA[2]*matrixB[10] + matrixA[3]*matrixB[14],
    matrixA[0]*matrixB[3] + matrixA[1]*matrixB[7] + matrixA[2]*matrixB[11] + matrixA[3]*matrixB[15],

    matrixA[4]*matrixB[0] + matrixA[5]*matrixB[4] + matrixA[6]*matrixB[8] + matrixA[7]*matrixB[12],
    matrixA[4]*matrixB[1] + matrixA[5]*matrixB[5] + matrixA[6]*matrixB[9] + matrixA[7]*matrixB[13],
    matrixA[4]*matrixB[2] + matrixA[5]*matrixB[6] + matrixA[6]*matrixB[10] + matrixA[7]*matrixB[14],
    matrixA[4]*matrixB[3] + matrixA[5]*matrixB[7] + matrixA[6]*matrixB[11] + matrixA[7]*matrixB[15],

    matrixA[8]*matrixB[0] + matrixA[9]*matrixB[4] + matrixA[10]*matrixB[8] + matrixA[11]*matrixB[12],
    matrixA[8]*matrixB[1] + matrixA[9]*matrixB[5] + matrixA[10]*matrixB[9] + matrixA[11]*matrixB[13],
    matrixA[8]*matrixB[2] + matrixA[9]*matrixB[6] + matrixA[10]*matrixB[10] + matrixA[11]*matrixB[14],
    matrixA[8]*matrixB[3] + matrixA[9]*matrixB[7] + matrixA[10]*matrixB[11] + matrixA[11]*matrixB[15],

    matrixA[12]*matrixB[0] + matrixA[13]*matrixB[4] + matrixA[14]*matrixB[8] + matrixA[15]*matrixB[12],
    matrixA[12]*matrixB[1] + matrixA[13]*matrixB[5] + matrixA[14]*matrixB[9] + matrixA[15]*matrixB[13],
    matrixA[12]*matrixB[2] + matrixA[13]*matrixB[6] + matrixA[14]*matrixB[10] + matrixA[15]*matrixB[14],
    matrixA[12]*matrixB[3] + matrixA[13]*matrixB[7] + matrixA[14]*matrixB[11] + matrixA[15]*matrixB[15]
]}



















































































/*
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = new Float32Array([0, 0.25, 0, 0.25, 0, 0, -0.25, 0, 0]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec3 pos;
     
    void main(){
        gl_Position = vec4(pos, 1.0);
    }
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    precision mediump float;

    uniform vec3 color;
    void main(){
        gl_FragColor = vec4(color, 1);
    }
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const posLocation = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const colorP = gl.getUniformLocation(program, 'color');

gl.useProgram(program);

let start=1;
let R=1;
let G=1;
let B=1;

function animate(){
    if(start==-1){
        gl.uniform3f(colorP, Math.random(R),Math.random(G),Math.random(B));
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(animate);
}
animate();

function st(){
    start*=-1;
}
*/