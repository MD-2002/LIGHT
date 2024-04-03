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

const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
    precision mediump float;
    attribute vec2 vtexture ;
    varying vec2 fragtexture;
    attribute vec3 pos;
    uniform float rotateX;
    uniform float rotateY;
    uniform float rotateZ;
    
    void main(){
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

        mat4 finalRotation = rotationZ * rotationY * rotationX;

        vec4 rotatedPos = finalRotation * vec4(pos, 1.0);
        gl_Position = rotatedPos;
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
const rotateXpos = gl.getUniformLocation(program, 'rotateX');
const rotateYpos = gl.getUniformLocation(program, 'rotateY');
const rotateZpos = gl.getUniformLocation(program, 'rotateZ');
gl.enableVertexAttribArray(posLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const textureLocation = gl.getAttribLocation(program, 'vtexture');
gl.enableVertexAttribArray(textureLocation);      
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

let rotation = 0;
let start4 = 1;
let start5 = 1;
let start6 = 1;

gl.enable(gl.DEPTH_TEST);

function animate() {
    rotation += 0.015;
    
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
    gl.bindTexture(gl.TEXTURE_2D,texturebuffer);
	gl.activeTexture(gl.TEXTURE0);
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