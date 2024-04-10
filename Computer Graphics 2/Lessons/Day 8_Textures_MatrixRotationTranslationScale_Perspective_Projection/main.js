const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

let image = document.getElementById("image");

const vertexData = new Float32Array([

   //FRONT
   0.4, 0.4, 0.4,
   0.4, -0.4, 0.4,
   -0.4, 0.4, 0.4,
   -0.4, 0.4, 0.4,
   0.4, -0.4, 0.4,
   -0.4, -0.4, 0.4,

   //BACK
   -0.4, 0.4, -0.4,
   -0.4, -0.4, -0.4,
   0.4, 0.4, -0.4,
   0.4, 0.4, -0.4,
   -0.4, -0.4, -0.4,
   0.4, -0.4, -0.4,
   
//Make the other sides invisible
/*
   //LEFT
   -0.4, 0.4, 0.4,
   -0.4, -0.4, 0.4,
   -0.4, 0.4, -0.4,
   -0.4, 0.4, -0.4,
   -0.4, -0.4, 0.4,
   -0.4, -0.4, -0.4,
   
   //RIGHT
   0.4, 0.4, -0.4,
   0.4, -0.4, -0.4,
   0.4, 0.4, 0.4,
   0.4, 0.4, 0.4,
   0.4, -0.4, 0.4,
   0.4, -0.4, -0.4,

   
   //TOP
   0.4, 0.4, 0.4,
   0.4, 0.4, -0.4,
   -0.4, 0.4, 0.4,
   -0.4, 0.4, 0.4,
   0.4, 0.4, -0.4,
   -0.4, 0.4, -0.4,

   //BOTTOM
   0.4, -0.4, 0.4,
   0.4, -0.4, -0.4,
   -0.4, -0.4, 0.4,
   -0.4, -0.4, 0.4,
   0.4, -0.4, -0.4,
   -0.4, -0.4, -0.4,
*/

]);

var texCoords = new Float32Array([
	//Front
	1,0,
	1,1,
	0,0,
	0,0,
	1,1,
	0,1,

    //Back
	0,0,
	0,1,
	1,0,
	1,0,
	0,1,
	1,1,

    //LEFT
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,

    //RIGHT
    0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1,

    //TOP
	0,1,
	0,0,
	1,1,
	1,1,
	0,0,
	1,0,

    //BOTTOM
	1,1,
	1,0,
	0,1,
	0,1,
	1,0,
	0,0,

	]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const texCoordBuffer = gl.createBuffer(); 
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoords,gl.STATIC_DRAW); 
	
const texturebuffer = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,texturebuffer);

/*
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

Only uncomment this area if you are going to comment the 137 line.
*/
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
gl.generateMipmap(gl.TEXTURE_2D);

/////////////////////////////////////////////////////////////////////////////////////////

const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
    precision mediump float;
    attribute vec2 vtexture ;
    varying vec2 fragtexture;
    attribute vec3 pos;
    uniform mat4 matrix;

    void main(){
        gl_Position =matrix*vec4(pos,1);
        fragtexture = vtexture;
    }
`);
gl.compileShader(vertexShader);

const fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    precision mediump float;
    varying vec2 fragtexture;
	uniform sampler2D fragsampler;
    void main(){
        gl_FragColor = texture2D(fragsampler, fragtexture);
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
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const textureLocation = gl.getAttribLocation(program, 'vtexture');
gl.enableVertexAttribArray(textureLocation);      
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

const matrixLocation=gl.getUniformLocation(program, 'matrix');

let start4 = 1;
let start5 = 1;
let start6 = 1;
let matrixA=identityMat4();
let matrixB= Math.PI/4;
let out= 0;
let out2= 0;
let out3= 0;
let x=0;
let y=0;
let z=0;

const scaleMatrix = scale(0.5, 0.5, 0);
const translationMatrix = translate(x, y, z);

function animate() {
    out+=0.05;
    out2+=0.05;
    out3+=0.05;

    /*Controlled by the certain buttons if you want to use it just give a look to the commands below:
    document.onkeydown = function (event) {
        switch (event.key) {
            case "r":       
                x +=0.01;
                break;
            case "l":       
                x -=0.01;
                break;
            case "u":       
                y +=0.01;
                break;
            case "d":       
                y -=0.01;
                break;
            case "m":       
                z +=0.01;
                break;
            case "n":       
                z -=0.01;
                break;
            case `ArrowUp`: 
                out += Math.PI/20;
                break;
            case `ArrowDown`: 
                out -= Math.PI/20;
                break;
            case `ArrowLeft`:  
                out2 += Math.PI/20;
                break;
            case `ArrowRight`: 
                out2 -= Math.PI/20;
                break;
            case "a":      
                out3 += Math.PI/20;
                break;
            case "c":       
                out3 -= Math.PI/20;
                break;
        }
    }
    const translationMatrix = translate(x, y, z);
    
   when using this function don't forget to comment const translationMatrix = translate(x, y, z); outside of the loop*/

    let rotationMatrix = identityMat4();
    rotationMatrix = rotateX(out);
    rotationMatrix = matrixMultiplication(rotateY(out2), rotationMatrix);
    rotationMatrix = matrixMultiplication(rotateZ(out3), rotationMatrix);

    // Apply rotation, scaling, and translation matrices
    let finalMatrix = matrixMultiplication(rotationMatrix, scaleMatrix);
    finalMatrix = matrixMultiplication(finalMatrix, translationMatrix);

    gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    requestAnimationFrame(animate);
}
animate();

/*Disabling screen buttons
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