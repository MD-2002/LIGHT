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

const vertexShaderSource = `
    precision mediump float;
    attribute vec3 pos;
    attribute vec3 color;
    varying vec3 vColor;
    uniform float rotate;
    uniform float rotateX;
    uniform float rotateY;
    uniform float rotateZ;
    void main(){
        vColor = color;
        mat3 rotationMatrix = mat3(
            cos(rotateY) * cos(rotateZ), -cos(rotateY) * sin(rotateZ), sin(rotateY),
            cos(rotateX) * sin(rotateZ) + sin(rotateX) * sin(rotateY) * cos(rotateZ), cos(rotateX) * cos(rotateZ) - sin(rotateX) * sin(rotateY) * sin(rotateZ), -sin(rotateX) * cos(rotateY),
            sin(rotateX) * sin(rotateZ) - cos(rotateX) * sin(rotateY) * cos(rotateZ), sin(rotateX) * cos(rotateZ) + cos(rotateX) * sin(rotateY) * sin(rotateZ), cos(rotateX) * cos(rotateY)
        );
        vec3 rotatedPos = rotationMatrix * pos;
        gl_Position = vec4(rotatedPos, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    void main(){
        gl_FragColor = vec4(vColor, 1);
    }
`;

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

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



/*CODE 2 OF DAY 5
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

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec3 pos;
    uniform vec2 translation;
    uniform float rotate;
    uniform float rotateX;
    uniform float rotateY;
    void main(){
        vec2 rotatedPos = vec2(
            (pos.x * cos(rotateX) - pos.y * sin(rotateX)) * cos(rotateY),
            (pos.y * cos(rotateX) + pos.x * sin(rotateX)) * cos(rotate) - pos.z * sin(rotate)
        );
        gl_Position = vec4(rotatedPos.x, rotatedPos.y, pos.z, 1.0);
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
gl.useProgram(program);

const posLocation = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const rotateXpos = gl.getUniformLocation(program, 'rotateX');
const rotateYpos = gl.getUniformLocation(program, 'rotateY');
const rotatepos = gl.getUniformLocation(program, 'rotate');

const colorP = gl.getUniformLocation(program, 'color');

let rotation=0;
let start = 1;
let start4 = 1;
let start5 = 1;
let start6 = 1;
let R = 1;
let G = 1;
let B = 1;

function animate() {
    rotation+=0.025;
    if (start == -1) {
        gl.uniform3f(colorP, Math.random() * R, Math.random() * G, Math.random() * B);
    }
    if (start4 == -1) {
        gl.uniform1f(rotateXpos, rotation);
        //gl.uniform1f(rotateYpos, 0);
        }
    if (start5 == -1) {
        gl.uniform1f(rotateYpos, rotation);
        //gl.uniform1f(rotateXpos, 0);
    }
    if (start6 == -1) {
        gl.uniform1f(rotatepos, rotation);
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
*/