const canvas = document.getElementById('canv');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('Webgl not available/supported !');
}


const vertexData= new Float32Array([
    0,1,0,
    1,-1,0,
    -1,-1,0,
    -1,1,1,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader =gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
attribute vec3 position;
void main(){
    gl_Position= vec4(position,1);
} `);

const fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
void main(){
    gl_FragColor = vec4(0,0,1,1);
}`);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation,4,gl.FLOAT,false,0,0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES,0,4);


