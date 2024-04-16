const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}
let image = document.getElementById("image");

var r=0.4;
const vertexData = new Float32Array([
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

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const texCoordBuffer = gl.createBuffer(); 
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoords,gl.STATIC_DRAW); 
	
const texturebuffer = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,texturebuffer);


gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
//gl.generateMipmap(gl.TEXTURE0);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
attribute vec2 vtexture ;
varying vec2 fragtexture;
attribute vec3 position;
uniform mat4 matrix;

void main() {
    fragtexture = vtexture;
    gl_Position = matrix * vec4(position, 1);
    
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec2 fragtexture;
uniform sampler2D fragsampler;

void main() {
    gl_FragColor = texture2D(fragsampler, fragtexture);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const posLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(posLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const textureLocation = gl.getAttribLocation(program, 'vtexture');
gl.enableVertexAttribArray(textureLocation);      
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const matrix = mat4.create();
mat4.translate(matrix, matrix, [0, 0, 0]);
mat4.scale(matrix, matrix, [1, 1, 1]);

gl.enable(gl.DEPTH_TEST);


function animate() {
    
    mat4.rotateX(matrix, matrix, Math.PI/70);
    mat4.rotateY(matrix, matrix, Math.PI/70);
    mat4.rotateZ(matrix, matrix, Math.PI/70);
    
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
	gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
	requestAnimationFrame(animate);
}
animate();