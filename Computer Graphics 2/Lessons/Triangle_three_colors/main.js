const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData=new Float32Array([
    0, 0.5, 0,    // V1.position
    .5, 0, 0,   // V2.position
    -.5,0,0,

]);

const colorData=new Float32Array([
    1,0,0,
    0,1,0,
    0,0,1,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const colorBuffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER,colorData , gl.DYNAMIC_DRAW);

const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
precision mediump float;

attribute vec3 pos;
attribute vec3 color;
varying vec3 vColor;

void main(){
    vColor=color;
    gl_Position=vec4(pos,2);
}
`);
gl.compileShader(vertexShader);

const fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
precision mediump float;
varying vec3 vColor;
void main(){
gl_FragColor=vec4(vColor,1);

}
`);
gl.compileShader(fragmentShader);

const program=gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const posLocation=gl.getAttribLocation(program,'pos');
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0,0);

const colorLocation=gl.getAttribLocation(program,'color');
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0,0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);