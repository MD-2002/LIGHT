const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexData = new Float32Array([
    // Vertices of the rectangle (lozenge)
    0, 0.5, 0,
    -0.5, 0, 0,
    0,-.5, 0,
    0.5,0, 0,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
uniform vec2 translation;
void main() {
    gl_Position = vec4(position.x + translation.x, position.y + translation.y, position.z, 1.0);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(0, 1, 0, 1);
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

const translationLocation = gl.getUniformLocation(program, 'translation');
const speed = 0.005; // Adjust speed as needed

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

let x = -0.50;
let y = 0;
let directionX = 1;
let directionY = 0;

    function animate(){
        x += directionX * speed;
        y += directionY * speed;

    if (x >= 0.50 && directionX > 0) {
        directionX = 0;
        directionY = 1;
    } else if (y >= 0.50 && directionY > 0) {
        directionX = -1;
        directionY = 0;
    } else if (x <= -0.50 && directionX < 0) {
        directionX = 0;
        directionY = -1;
    } else if (y <= -0.50 && directionY < 0) {
        directionX = 1;
        directionY = 0;
    }
        gl.uniform2f(translationLocation, x, y);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        requestAnimationFrame(animate);
    }
    animate();