const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('Webgl not supported !');
}

const vertexData= new Float32Array([
    0,0.5,0,
    .5,0,0,
    -.5,0,0,
    0,-.5,0,
    0.5,0,0,1


]);

const buffer= gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
attribute vec3 position;

uniform mat4 matrix;
void main(){
    gl_Position = matrix * vec4(position,1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
void main(){
    gl_FragColor= vec4(0,0,1,1);
}
`);
gl.compileShader(fragmentShader);

const program= gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocation ={
    matrix: gl.getUniformLocation(program, `matrix`)
};

const matrix = mat4.create();
mat4.translate(matrix, matrix, [.2, .5, 0]);
mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

function animate(){
requestAnimationFrame(animate);
//mat4.rotateY(matrix, matrix, Math.PI/2 /50);
mat4.rotateX(matrix, matrix, Math.PI/2 /70);
//mat4.rotateZ(matrix, matrix, Math.PI/6 /70);
gl.uniformMatrix4fv(uniformLocation.matrix,false,matrix);
gl.drawArrays(gl.TRIANGLE_FAN,0,5);
}
animate();