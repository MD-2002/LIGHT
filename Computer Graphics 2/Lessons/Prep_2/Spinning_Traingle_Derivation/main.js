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
    -.5, -.5, 0,   // V2.position
    .5, -.5, 0, //v3
];

const colorData = [
    1, 0, 0,    // V1.color
    0, 1, 0,    // V2.color
    0, 0, 1,    // V3.color
];

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);


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

const posLocation = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const matrixLocation=gl.getUniformLocation(program, 'matrix');

let matrixA=identityMat4();
let matrixB= Math.PI/4;
let out= 0;
let out2= 0;
let out3= 0;


const scaleMatrix = scale(0.5, 0.5, 0);
const translationMatrix = translate(0, 0, 0);

function animate() {
    document.onkeydown = function (event) {
        switch (event.key) {
            case `x`: 
            out+=Math.PI/20;
                break;
            case `y`: 
            out2+=Math.PI/20;
                break;
            case `z`:  
            out3+=Math.PI/20;
                break;
                case `X`: 
            out+=Math.PI/20;
                break;
            case `Y`: 
            out2+=Math.PI/20;
                break;
            case `Z`:  
            out3+=Math.PI/20;
                break;
        }
    }
    let rotationMatrix = identityMat4();
    rotationMatrix = rotateX(out);
    rotationMatrix = matrixMultiplication(rotateY(out2), rotationMatrix);
    rotationMatrix = matrixMultiplication(rotateZ(out3), rotationMatrix);

    let finalMatrix = matrixMultiplication(rotationMatrix, scaleMatrix);
    finalMatrix = matrixMultiplication(finalMatrix, translationMatrix);

    gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    requestAnimationFrame(animate);
}

animate();

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
function scale(sx, sy, sz) {
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    ];
}

function translate(tx, ty, tz) {
    return [
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        tx, ty, tz, 1
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