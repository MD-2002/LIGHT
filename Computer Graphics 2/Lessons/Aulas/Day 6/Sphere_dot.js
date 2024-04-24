const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const numSides = 100; // Number of sides in the shape
const radius = 0.7; // Radius of the circle
let vertexData = []; // Start with an empty array

// Generate the vertices of the sphere
for(let i = 0; i <= numSides; i++) {
    let lat = Math.PI * i / numSides;
    for(let j = 0; j <= numSides; j++) {
        let lng = 2 * Math.PI * j / numSides;
        let x = Math.cos(lng) * Math.sin(lat) * radius;
        let y = Math.cos(lat) * radius;
        let z = Math.sin(lng) * Math.sin(lat) * radius;
        vertexData.push(x, y, z);
    }
}

vertexData = new Float32Array(vertexData);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1);
    gl_PointSize=25.0;
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

gl.drawArrays(gl.POINTS, 0, vertexData.length / 3);