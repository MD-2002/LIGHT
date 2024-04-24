const canvas = document.querySelector(`canvas`);
const gl = canvas.getContext(`webgl`); 

if(!gl){throw new Error("WebGL not supported!");}


gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
let r = 0.5; 

const vertexData = new Float32Array([
    
  //FRONT FACE RED
  -r,r,-r, 1,0,0,  -r,-r,-r, 1,0,0,  r,-r,-r, 1,0,0, 
  r,r,-r,  1,0,0,  -r,r,-r,  1,0,0,  r,-r,-r, 1,0,0,  

  //BACK FACE BLUE
  -r,r,r, 0,0,1,  -r,-r,r, 0,0,1,  r,-r,r, 0,0,1,
  r,r,r,  0,0,1,  -r,r,r, 0,0,1,   r,-r,r, 0,0,1, 

]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,
`attribute vec3 pos;
attribute vec3 colour;
varying vec3 vcolour;
uniform mat4 model;

void main() { 
    vcolour = colour;
    gl_Position = model*vec4(pos,1);
}`);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
   console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader))}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,
`precision mediump float; 
varying vec3 vcolour;
void main() {
     gl_FragColor = vec4(vcolour,1);
     }`);
     gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, `pos`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6*4, 0);

const coloursLocation = gl.getAttribLocation(program, `colour`);
gl.enableVertexAttribArray(coloursLocation);
gl.vertexAttribPointer(coloursLocation, 3, gl.FLOAT, false, 6*4, 3*4);
const matrixLocation=gl.getUniformLocation(program, `model`)
 
let matrixA = identityMat4();
let matrixB = Math.PI/4;
let out= 0;
let out2= 0;
let out3= 0;

function draw(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  model = matrixMultiplication(identityMat4(),rotateX(out));      
  model = matrixMultiplication(model,rotateY(out2));           
  model = matrixMultiplication(model,rotateZ(out3));
  gl.uniformMatrix4fv(matrixLocation, false, model);
  gl.drawArrays(gl.TRIANGLES, 0, vertexData.length/6);
  requestAnimationFrame(draw);
}
draw();
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