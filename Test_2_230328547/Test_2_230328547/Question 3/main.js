const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

let image = document.getElementById("image");

var r = 0.4;
var vertexData = new Float32Array([
    // Front
    r, r, r,
    r, -r, r,
    -r, r, r,
    -r, r, r,
    r, -r, r,
    -r, -r, r,

    // Back
    r, r, -r,
    r, -r, -r,
    -r, r, -r,
    -r, r, -r,
    r, -r, -r,
    -r, -r, -r,
]);

var texCoords = new Float32Array([
    // Front
    1, 1,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    0, 0,

    // Back
    0, 1,
    0, 0,
    1, 1,
    1, 1,
    0, 0,
    1, 0,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

const texturebuffer = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texturebuffer);

// Set texture parameters
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

/////////////////////////////////////////////////////////////////////////////////////////

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    precision mediump float;
    attribute vec2 vtexture;
    varying vec2 fragtexture;
    attribute vec3 pos;
    uniform mat4 matrix;

    void main() {
        gl_Position = matrix * vec4(pos, 1);
        fragtexture = vtexture;
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
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const posLocation = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

const textureLocation = gl.getAttribLocation(program, 'vtexture');
gl.enableVertexAttribArray(textureLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

const matrixLocation = gl.getUniformLocation(program, 'matrix');

let start4 = 1;
let start5 = 1;
let start6 = 1;
let matrixA = identityMat4();
let matrixB = Math.PI / 4;
let out = 0;
let out2 = 0;
let out3 = 0;
let x = 0;
let y = 0;

const scaleMatrix = scale(1, 1, 1);

function perspectiveTransformation(d) {
    // The d parameter controls the perspective transformation.
    // It is the distance from the camera to the near plane.
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, -1 / d,
        0, 0, 0, 1
    ]);
}

function animate() {
    // Define the distance to the near plane for the perspective transformation
    const nearDistance = 1;

    // Calculate perspective transformation matrix
    const perspectiveMatrix = perspectiveTransformation(nearDistance);
    document.onkeydown = function (event) {
        switch (event.key) {
            case "ArrowUp":
                y += 0.05;
                break;
            case "ArrowDown":
                y -= 0.05;
                break;
            case "ArrowRight":
                x += 0.05;
                break;
            case "ArrowLeft":
                x -= 0.05;
                break;
        }
    };
    // Create translation and rotation matrices
    const translationMatrix = translate(x, y, -1);
    let rotationMatrix = identityMat4();
    if (start4 == -1) {
        out += Math.PI / 70;
        start4 = 1;
    } else if (start5 == -1) {
        out2 += Math.PI / 70;
        start5 = 1;
    } else if (start6 == -1) {
        out3 += Math.PI / 70;
        start6 = 1;
    }
    rotationMatrix = rotateX(out);
    rotationMatrix = matrixMultiplication(rotateY(out2), rotationMatrix);
    rotationMatrix = matrixMultiplication(rotateZ(out3), rotationMatrix);

    // Combine transformations
    let finalMatrix = matrixMultiplication(rotationMatrix, scaleMatrix);
    finalMatrix = matrixMultiplication(finalMatrix, translationMatrix);
    finalMatrix = matrixMultiplication(perspectiveMatrix, finalMatrix);

    // Set the final transformation matrix
    gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);

    // Clear the color buffer and draw the triangles
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

    // Request the next animation frame
    requestAnimationFrame(animate);
}
animate();

function st() {
    start4 *= -1;
}

function st2() {
    start5 *= -1;
}

function st3() {
    start6 *= -1;
}

// Matrix functions

function identityMat4() {
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
        0, 0, 0, 1,
    ];
}

function rotateY(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1,
    ];
}

function rotateZ(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}

function scale(sx, sy, sz) {
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1,
    ];
}

function translate(tx, ty, tz) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1,
    ];
}

// Projection function
function perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0,
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