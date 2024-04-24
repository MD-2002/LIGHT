const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
throw new Error ("webgl is not available !");
}

const vertexData=new Float32Array([0.5,0.5,0]);

const buffer= gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
attribute vec3 pos;
void main(){
 gl_Position=vec4(pos,1);
 gl_PointSize=30.0;
}
`);
gl.compileShader(vertexShader);

const fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
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

const posLocation= gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0,0);

gl.useProgram(program);
gl.drawArrays(gl.POINTS,0,1);