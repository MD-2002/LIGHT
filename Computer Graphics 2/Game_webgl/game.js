const canvas = document.getElementById('gameCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

// Initialize game variables
let points = 0;
let playerPosition = 0; // -1 to 1 range for horizontal movement
const playerSize = 0.05;
const fallingObjects = [];
const pointsLabel = document.getElementById('pointsLabel');
const TimesLabel = document.getElementById('timesLostLabel');
let timesLost = 0;
let hitCount = 0;
let speed = 0.5; // Initial speed
let gameOver = false;

// Vertex shader source code
const vertexShaderSource = `
    attribute vec2 aPosition;
    uniform float uYPosition;
    uniform float uXPosition;
    uniform float uSize;
    varying vec2 vPosition;
    void main() {
        gl_Position = vec4(aPosition.x * uSize + uXPosition, aPosition.y * uSize + uYPosition, 0.0, 1.0);
        vPosition = aPosition;
    }
`;

// Fragment shader source code
const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;

// Create shader program
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader));
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Attribute and uniform locations
const aPositionLocation = gl.getAttribLocation(program, 'aPosition');
const uYPositionLocation = gl.getUniformLocation(program, 'uYPosition');
const uXPositionLocation = gl.getUniformLocation(program, 'uXPosition');
const uSizeLocation = gl.getUniformLocation(program, 'uSize');
const uColorLocation = gl.getUniformLocation(program, 'uColor');

// Set up the position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = new Float32Array([
    // Vertex positions for a square
    -1, -1,
    1, -1,
    1, 1,
    -1, -1,
    1, 1,
    -1, 1,
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
gl.enableVertexAttribArray(aPositionLocation);
gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

// Adjust the sliding speed of the box (player)
const playerSpeed = 0.02; // Decreased speed for a more coherent slide

// Update the player's position based on keyboard input
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            leftPressed = true;
            break;
        case 'ArrowRight':
            rightPressed = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            leftPressed = false;
            break;
        case 'ArrowRight':
            rightPressed = false;
            break;
    }
});

// Update the falling objects' positions
function updateFallingObjects(deltaTime) {
    // Iterate through the falling objects from the end to the beginning
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        // Update the falling object's position based on deltaTime and speed
        obj.y -= deltaTime * speed;

        // Check for collision with the player
        if (obj.y - obj.size / 2 <= -0.8 + playerSize / 2 && 
            obj.y + obj.size / 2 >= -0.8 - playerSize / 2 && 
            obj.x - obj.size / 2 <= playerPosition + playerSize / 2 && 
            obj.x + obj.size / 2 >= playerPosition - playerSize / 2) {
            points++; // Increment points when a collision occurs
            hitCount++; // Increment hit count
            if (hitCount >= 3) {
                // Game over
                timesLost++;
                points = 0; // Reset points
                gameOver = true;
            }
        }

        // Handle objects that go off screen (below the canvas)
        if (obj.y + obj.size / 2 < -1) {
            // Remove the object
            fallingObjects.splice(i, 1);
        }
    }
}

// Draw the scene
function drawScene() {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the player (cube)
    gl.uniform4fv(uColorLocation, [0.0, 1.0, 0.0, 1.0]); // Green color
    gl.uniform1f(uYPositionLocation, -0.8); // Player Y position
    gl.uniform1f(uXPositionLocation, playerPosition); // Player X position
    gl.uniform1f(uSizeLocation, playerSize);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Draw the falling objects
    fallingObjects.forEach(obj => {
        gl.uniform4fv(uColorLocation, obj.color);
        gl.uniform1f(uYPositionLocation, obj.y);
        gl.uniform1f(uXPositionLocation, obj.x);
        gl.uniform1f(uSizeLocation, obj.size);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    });
}

// Create falling objects at regular intervals with some randomness
function createFallingObject() {
    const object = {
        x: Math.random() * 2 - 1, // Random horizontal position
        y: 1.0, // Start at the top of the screen
        size: 0.05, // Size of the falling object
        color: [1.0, 0.0, 0.0, 1.0], // Red color
    };
    fallingObjects.push(object);
}

// Function to pause/unpause the game
let isPaused = false;
function pauseGame() {
    if (gameOver) {
        return; // Don't pause if game is already over
    }
    if (isPaused) {
        // Unpause the game
        mainLoopId = requestAnimationFrame(mainLoop);
    } else {
        // Pause the game
        cancelAnimationFrame(mainLoopId);
    }
    isPaused = !isPaused;
}

// Function to restart the game
function restartGame() {
    location.reload();
}

// Main loop
function mainLoop(time) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    if (leftPressed) {
        playerPosition -= playerSpeed; // Move left
        if (playerPosition < -1) {
            playerPosition = -1; // Prevent moving off the left edge
        }
    }
    if (rightPressed) {
        playerPosition += playerSpeed; // Move right
        if (playerPosition > 1) {
            playerPosition = 1; // Prevent moving off the right edge
        }
    }

    // Boundary checks
    if (playerPosition < -1 + playerSize / 2) {
        playerPosition = -1 + playerSize / 2; // Prevent moving off the left edge
    }
    if (playerPosition > 1 - playerSize / 2) {
        playerPosition = 1 - playerSize / 2; // Prevent moving off the right edge
    }

    updateFallingObjects(deltaTime);

    // Increase speed over time
    speed += 0.001;

    // Randomly create falling objects with an increased probability
    if (Math.random() < 0.05) {
        createFallingObject();
    }

    drawScene();

    if (!gameOver) {
        mainLoopId = requestAnimationFrame(mainLoop);
    } else {
        const points = Math.floor(speed * 10);
        pointsLabel.textContent = `Points: ${points}`; // Update points label
        TimesLabel.textContent = `Times Lost: ${timesLost}`; // Update points label
        alert(`Game Over! You lost ${timesLost} times. Points: ${points}`);
    }
}

let lastTime = 0;
let mainLoopId = requestAnimationFrame(mainLoop);