const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

let image = document.getElementById("image");

var r=0.5;
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
	
var texCoords = new Float32Array([
	//front
	1,1,
	1,0,
	0,1,
	0,1,
	1,0,
	0,0,
		
	//back
	0,1,
	0,0,
	1,1,
	1,1,
	0,0,
	1,0,
	
	//top
	1,0,
	0,0,
	0,1,
	1,0,
	0,1,
	1,1,
	
	//bottom
	1,1,
	0,1,
	0,0,
	1,1,
	0,0,
	1,0,

	//left
	1,0,
	1,1,
	0,0,
	0,0,
	1,1,
	0,1,
	
	//right
	0,0,
	0,1,
	1,0,
	1,0,
	0,1,
	1,1,
	]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const texCoordBuffer = gl.createBuffer(); 
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoords,gl.STATIC_DRAW); 
	
const texturebuffer = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,texturebuffer);

//
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
//gl.generateMipmap(gl.TEXTURE_2D);

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

const fragmentShader2 =gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader2, `
    void main(){
        gl_FragColor = vec4(1,0,0,1);
    }
`);
gl.compileShader(fragmentShader2);

const fragmentShader3 =gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader3, `
    void main(){
        gl_FragColor = vec4(0,1,0,1);
    }
`);
gl.compileShader(fragmentShader3);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

//
const program2 = gl.createProgram();
gl.attachShader(program2, vertexShader);
gl.attachShader(program2, fragmentShader2);
gl.linkProgram(program2);
gl.useProgram(program2);

//
const program3 = gl.createProgram();
gl.attachShader(program3, vertexShader);
gl.attachShader(program3, fragmentShader3);
gl.linkProgram(program3);
gl.useProgram(program3);

const posLocation = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

//
const posLocation2 = gl.getAttribLocation(program2, 'pos');
gl.enableVertexAttribArray(posLocation2);
gl.vertexAttribPointer(posLocation2, 3, gl.FLOAT, false, 0, 0);

//
const posLocation3 = gl.getAttribLocation(program3, 'pos');
gl.enableVertexAttribArray(posLocation3);
gl.vertexAttribPointer(posLocation3, 3, gl.FLOAT, false, 0, 0);

const textureLocation = gl.getAttribLocation(program, 'vtexture');
gl.enableVertexAttribArray(textureLocation);      
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

const matrixLocation=gl.getUniformLocation(program, 'matrix');
const matrixLocation2=gl.getUniformLocation(program2, 'matrix');
const matrixLocation3=gl.getUniformLocation(program3, 'matrix');

let matrixA=identityMat4();
let matrixB= Math.PI/4;
let out= 0;
let out2= 0;
let out3= 0;

//
let out4= 0;
let out5= 0;
let out6= 0;

//
let out7= 0;
let out8= 0;
let out9= 0;

const scaleMatrix = scale(0.3, 0.3, 0);
const translationMatrix = translate(-0.75, 0, 0);

const scaleMatrix1 = scale(0.3, 0.3, 0);
const translationMatrix1= translate(0, 0, 0);

const scaleMatrix2 = scale(0.3, 0.3, 0);
const translationMatrix2= translate(0.75, 0, 0);

function animate() {
     gl.useProgram(program);
    document.onkeydown = function (event) {
        switch (event.key) {
            case `ArrowUp`: //Move first cube on the x axis clockwise
                out += Math.PI/20;
                break;
            case `ArrowDown`: //Move first cube on the x axis anticlockwise
                out -= Math.PI/20;
                break;
            case `ArrowLeft`:  //Move first cube on the y axis clockwise
                out2 += Math.PI/20;
                break;
            case `ArrowRight`: //Move first cube on the y axis anticlockwise
                out2 -= Math.PI/20;
                break;
            case "a":      //Move first cube on the z axis clockwise
                out3 += Math.PI/20;
                break;
            case "c":       //Move first cube on the z axis anticlockwise
                out3 -= Math.PI/20;
                break;
                //
            case "b":      //Move second cube on the x axis clockwise
                out4 += Math.PI/20;
                break;
            case "d":       //Move second cube on the x axis anticlockwise
                out4 -= Math.PI/20;
                break;
            case "e":      //Move second cube on the y axis clockwise
                out5 += Math.PI/20;
                break;
            case "f":      //Move second cube on the y axis anticlockwise
                out5 -= Math.PI/20;
                break;
            case "h":      //Move second cube on the z axis clockwise
                out6 += Math.PI/20;
                break;
            case "n":      //Move second cube on the z axis anticlockwise
                out6 -= Math.PI/20;
                break;
            //
            case "p":      //Move third cube on the x axis clockwise
                out7 += Math.PI/20;
                break;
            case "o":       //Move third cube on the x axis anticlockwise
                out7 -= Math.PI/20;
                break;
            case "l":      //Move third cube on the y axis clockwise
                out8 += Math.PI/20;
                break;
            case "k":      //Move third cube on the y axis anticlockwise
                out8 -= Math.PI/20;
                break;
            case "u":      //Move third cube on the z axis clockwise
                out9 += Math.PI/20;
                break;
            case "y":      //Move third cube on the z axis anticlockwise
                out9 -= Math.PI/20;
                break;
        }
    }

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

    //
    gl.useProgram(program2);
    rotationMatrix = rotateX(out4);
     rotationMatrix = matrixMultiplication(rotateY(out5), rotationMatrix);
    rotationMatrix = matrixMultiplication(rotateZ(out6), rotationMatrix);
    let finalMatrix1 = matrixMultiplication(rotationMatrix, scaleMatrix1);
    finalMatrix1 = matrixMultiplication(finalMatrix1, translationMatrix1);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    gl.uniformMatrix4fv(matrixLocation2, false, finalMatrix1);
    //
    
    gl.useProgram(program3);
    rotationMatrix = rotateX(out7);
     rotationMatrix = matrixMultiplication(rotateY(out8), rotationMatrix);
    rotationMatrix = matrixMultiplication(rotateZ(out9), rotationMatrix);
    let finalMatrix2 = matrixMultiplication(rotationMatrix, scaleMatrix2);
    finalMatrix2 = matrixMultiplication(finalMatrix2, translationMatrix2);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    gl.uniformMatrix4fv(matrixLocation3, false, finalMatrix2);

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