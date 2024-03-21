const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = new Float32Array([
   //FRONT
   0.25, 0.25, 0.25,
   0.25, -0.25, 0.25,
   -0.25, 0.25, 0.25,
   -0.25, 0.25, 0.25,
   0.25, -0.25, 0.25,
   -0.25, -0.25, 0.25,
   //LEFT
   -0.25, 0.25, 0.25,
   -0.25, -0.25, 0.25,
   -0.25, 0.25, -0.25,
   -0.25, 0.25, -0.25,
   -0.25, -0.25, 0.25,
   -0.25, -0.25, -0.25,
   //BACK
   -0.25, 0.25, -0.25,
   -0.25, -0.25, -0.25,
   0.25, 0.25, -0.25,
   0.25, 0.25, -0.25,
   -0.25, -0.25, -0.25,
   0.25, -0.25, -0.25,
   //RIGHT
   0.25, 0.25, -0.25,
   0.25, -0.25, -0.25,
   0.25, 0.25, 0.25,
   0.25, 0.25, 0.25,
   0.25, -0.25, 0.25,
   0.25, -0.25, -0.25,
   //TOP
   0.25, 0.25, 0.25,
   0.25, 0.25, -0.25,
   -0.25, 0.25, 0.25,
   -0.25, 0.25, 0.25,
   0.25, 0.25, -0.25,
   -0.25, 0.25, -0.25,
   //BOTTOM
   0.25, -0.25, 0.25,
   0.25, -0.25, -0.25,
   -0.25, -0.25, 0.25,
   -0.25, -0.25, 0.25,
   0.25, -0.25, -0.25,
   -0.25, -0.25, -0.25,
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
    uniform mat4 rotationMatrix;  // Use mat4 for rotation
    uniform float rotateX;
    uniform float rotateY;
    uniform float rotateZ;
    
    void main(){
        vColor = color;
        mat4 rotationX = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, cos(rotateX), -sin(rotateX), 0.0,
            0.0, sin(rotateX), cos(rotateX), 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        mat4 rotationY = mat4(
            cos(rotateY), 0.0, sin(rotateY), 0.0,
            0.0, 1.0, 0.0, 0.0,
            -sin(rotateY), 0.0, cos(rotateY), 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        mat4 rotationZ = mat4(
            cos(rotateZ), -sin(rotateZ), 0.0, 0.0,
            sin(rotateZ), cos(rotateZ), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        mat4 finalRotation = rotationZ * rotationY * rotationX; // Combine rotations

        vec4 rotatedPos = finalRotation * vec4(pos, 1.0);
        gl_Position = rotatedPos;
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
const rotateXpos = gl.getUniformLocation(program, 'rotateX');
const rotateYpos = gl.getUniformLocation(program, 'rotateY');
const rotateZpos = gl.getUniformLocation(program, 'rotateZ');

gl.enableVertexAttribArray(posLocation);
gl.enableVertexAttribArray(colorLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

let rotation = 0;
let start4 = 1;
let start5 = 1;
let start6 = 1;

gl.enable(gl.DEPTH_TEST);

function animate() {
    rotation += 0.025;
    if (start6 == -1) {
        gl.uniform1f(rotateXpos, rotation);
    }
    if (start5 == -1) {
        gl.uniform1f(rotateYpos, rotation);
    }
    if (start4 == -1) {
        gl.uniform1f(rotateZpos, rotation);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    requestAnimationFrame(animate);
}

animate();

function st() {
    start *= -1;
}

function st_2() {
    start6 *= -1;
}

function st_3() {
    
    start5 *= -1;
}

function st_4() {
    start4 *= -1;
}

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