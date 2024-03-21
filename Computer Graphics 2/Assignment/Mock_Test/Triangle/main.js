const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = new Float32Array([0, 0.25, 0,  0.25, 0, 0,  -0.25, 0, 0]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec3 pos;
    uniform vec2 translation;
    uniform float rotation;
    uniform float rotateX;
    uniform float rotateY;

    void main(){
       
        vec2 rotatedPos = vec2(
            (pos.x * cos(rotateX) - pos.y * sin(rotateX)) * cos(rotateY),
            (pos.y * cos(rotateX) + pos.x * sin(rotateX)) * cos(rotation) - pos.z * sin(rotation)
            );

        gl_Position = vec4(rotatedPos.x + translation.x, rotatedPos.y + translation.y, pos.z, 1.0);
    }
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    void main(){
        gl_FragColor = vec4(1, 0, 0, 1);
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

const translationLocation = gl.getUniformLocation(program, 'translation');
const rotationLocation = gl.getUniformLocation(program, 'rotation');
const rotateXLocation = gl.getUniformLocation(program, 'rotateX');
const rotateYLocation = gl.getUniformLocation(program, 'rotateY');
const speed = 0.03;

let x = -0.75;
let y = 0;
let z = 0;
let directionX = 1;
let directionY = 0;
let directionZ = 0;
let start = 1;
let start2 = 1;
let start3 = 1;
let rotation = 0;

gl.useProgram(program);
function animate() {
    rotation += 0.05;
    x += directionX * speed;
    y += directionY * speed;
    if (x >= 0.75 && directionX > 0) {
        directionX = 0;
        directionY = 1;
    } else if (y >= 0.80 && directionY > 0) {
        directionX = -1;
        directionY = 0;
    } else if (y <= -0.80 && directionY < 0) {
        directionX = 1;
        directionY = 0;
    } else if (x <= -0.75 && directionX < 0) {
        directionX = 0;
        directionY = -1;
    }
    if (start == 1) {
        gl.uniform1f(rotationLocation, rotation);
    }
    if (start2 == 1) {
        gl.uniform1f(rotateXLocation, rotation);
        gl.uniform1f(rotateYLocation, 0);
    }
    if (start3 == 1) {
        gl.uniform1f(rotateYLocation, rotation);
        gl.uniform1f(rotateXLocation, 0);
    }
    gl.uniform2f(translationLocation, x, y, z);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(animate);
}
animate();
function Z() {
    start2 *= -1;
}
function X() {
    start *= -1;
}
function Y() {
    start3 *= -1;
}