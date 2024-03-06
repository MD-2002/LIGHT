const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('Webgl is not available !');
}

const vertexData=new Float32Array([
    0,0,0
]);

const buffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
attribute vec3 position;
uniform vec2 translation;
uniform float rotation;
void main(){
    float cosR = cos(rotation);
    float sinR = sin(rotation);
    vec2 rotatedPosition=vec2(position.x*cosR-position.y*sinR,position.x*sinR+position.y*cosR);
    gl_Position=vec4(rotatedPosition.x+translation.x, rotatedPosition.y+translation.y,position.z,1.0);
    gl_PointSize=25.0;
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
void main(){
    gl_FragColor=vec4(1,0,0,1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT , false , 0 , 0);

gl.useProgram(program);
const translationLocation =gl.getUniformLocation(program,'translation') ;
const rotationLocation = gl.getUniformLocation(program,'rotation');
let speed=0.05;

let x=-0.80;
let y=0;
let directionX=1;
let directionY=0;
let rotation=0;

animate();

function animate(){
    x += directionX*speed;
    y += directionY*speed;
    rotation+=0.13;

    if(x>=0.90 && directionX>0){
        directionX=0;
        directionY=1;
    }else if (x <= -0.90 && directionX<0) {
        directionX=0;
        directionY=-1;
    }else if(y>=0.80 && directionY>0){
        directionX=-1;
        directionY=0;
    }else if(y<= -0.80 && directionY<0){
        directionX=1;
        directionY=0;
    }

    gl.uniform2f(translationLocation, x, y);
    gl.uniform1f(rotationLocation, rotation);
    gl.drawArrays(gl.POINTS, 0, 2);
    requestAnimationFrame(animate);
}