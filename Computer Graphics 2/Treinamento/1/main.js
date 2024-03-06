const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('Webgl is not available !');
}

const vertexData= new Float32Array([
    0,0.13,0,
    0.13,0,0,
    -0.13,0,0,
]);

//second figure
const vertexData2 = new Float32Array([
    0.13, 0.13, 0,
    0.13, -0.13, 0,
    -0.13, -0.13, 0,
    -.13,.13,0,
]);

//Third Figure
const vertexData3 = new Float32Array([
    0.13, 0.13, 0,
    0.13, -0.13, 0,
    -0.13, -0.13, 0,
    -.13,.13,0,
]);

//First Figure
const buffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData,gl.STATIC_DRAW);

//second figure
const buffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, vertexData2, gl.STATIC_DRAW);

//Third figure
const buffer3 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
gl.bufferData(gl.ARRAY_BUFFER, vertexData3, gl.STATIC_DRAW);


const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
attribute vec3 position;
uniform float rotation;
uniform vec2 translation;
void main(){
    vec2 rotatedPosition=vec2(position.x*cos(rotation)-position.y*sin(rotation), position.x*sin(rotation)+position.y*cos(rotation));
    gl_Position=vec4(rotatedPosition.x+translation.x, rotatedPosition.y+translation.y, position.z,1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
void main(){
    gl_FragColor=vec4(1, 0, 0, 1);
}
`);
gl.compileShader(fragmentShader);

const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader2,`
void main(){
    gl_FragColor = vec4(0, 1, 0, 1); // Green color
}
`);
gl.compileShader(fragmentShader2);

const fragmentShader3 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader3,`
void main(){
    gl_FragColor = vec4(0, 0, 1, 1); // Green color
}
`);
gl.compileShader(fragmentShader3);

const program=gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const program2 = gl.createProgram();
gl.attachShader(program2, vertexShader);
gl.attachShader(program2, fragmentShader2);
gl.linkProgram(program2);

const program3 = gl.createProgram();
gl.attachShader(program3, vertexShader);
gl.attachShader(program3, fragmentShader3);
gl.linkProgram(program3);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3 , gl.FLOAT , false , 0 , 0);

const positionLocation2 = gl.getAttribLocation(program2, 'position');
gl.enableVertexAttribArray(positionLocation2);
gl.vertexAttribPointer(positionLocation2, 3 , gl.FLOAT , false , 0 , 0);

const positionLocation3 = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation3);
gl.vertexAttribPointer(positionLocation3, 3 , gl.FLOAT , false , 0 , 0);

const rotatedLocation = gl.getUniformLocation(program, 'rotation');
const translationLocation = gl.getUniformLocation(program, 'translation');
const translationLocation2 = gl.getUniformLocation(program2, 'translation');
const translationLocation3 = gl.getUniformLocation(program3, 'translation');
const speed=0.050;
const speed2=0.060;
const speed3=0.10;


let rotation=0;
let x =-0.75;
let y =0;
let directionX=1;
let directionY=0;
let start=1;

let x2 = 0;
let y2 = 0;
let directionX2 = 1;
let directionY2 = 0;

let x3 = 0.40;
let y3 = 0;
let directionX3 = 0;
let directionY3 = 1;

function animate(){
if(start==1){
    rotation +=0.30;
    x += directionX * speed;
    y += directionY * speed;

    x2 += directionX2 * speed2;
    y2 += directionY2 * speed2;

    x3 += directionX3 * speed3;
    y3 += directionY3 * speed3;

// figure 1
    if(x>=0.75 && directionX>0){
        directionX=0;
        directionY=1;
    }else if(y>=0.75 && directionY>0){
        directionX=-1;
        directionY=0;
    }else if(x<=-0.75 && directionX<0){
        directionX=0;
        directionY=-1;
    }else if(y<=-0.85 && directionY<0){
        directionX=1;
        directionY=0;
    }

    //shake figure 2 in the x axis
    directionX2 *= -1;

//figure 3
    if(y3>=0.75 &&  directionY3>0) {
        directionX3=0;
        directionY3=-1;
    }else if(y3<=-0.75 && directionY3<0){
        directionX3=0;
        directionY3=1;
    }
}
    //Figure 1
    gl.useProgram(program);
    gl.uniform1f(rotatedLocation, rotation);
    gl.uniform2f(translationLocation , x , y );
    gl.drawArrays(gl.TRIANGLES,0,3);
    
    //Figure 2
    gl.useProgram(program2);
    gl.uniform2f(translationLocation2, x2 , y2 );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    //Figure 3
    gl.useProgram(program3);
    gl.uniform2f(translationLocation3, x3 , y3 );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(animate);
}
animate();

function st(){
    start*=-1;
}
