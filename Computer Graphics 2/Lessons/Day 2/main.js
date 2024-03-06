const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not available/supported");
} else {
  const jsarray = [0, 0];
  var x, y;
  var deltaP = (2 * Math.PI) / 64;
  var arch = 2 * Math.PI;
  var r = 1;

  for (p = 0; p <= arch; p += deltaP) {
    x = r * Math.cos(p);
    y = r * Math.sin(p);

    jsarray.push(x);
    jsarray.push(y);
  }

  webgl.clearColor(0.1, 0.3, 0.1, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  const vertices = new Float32Array(jsarray);
  const buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

  const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
  webgl.shaderSource(
    vertexShader,
    `attribute vec2 pos;
uniform float shift;
void main() { gl_Position = vec4(pos*0.25,0,1)+ vec4(shift,0,0,0)+ vec4(-0.75,0.5,0,0); }`
  );
  webgl.compileShader(vertexShader);

  const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
  webgl.shaderSource(
    fragmentShader,
    `void main() { gl_FragColor = vec4(0.6,0.7,0.5,1); }`
  );
  webgl.compileShader(fragmentShader);

  const program = webgl.createProgram();
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);
  webgl.useProgram(program);
  const positionLocation = webgl.getAttribLocation(program, `pos`);
  webgl.enableVertexAttribArray(positionLocation);
  webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

  const uniformLocation = webgl.getUniformLocation(program, `shift`);
  let myshift = 0;
  let shift = 0.001;
  let start = 1;
  draw();
  function draw() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    if (start == 1) {
      myshift += shift;
    }

    webgl.uniform1f(uniformLocation, myshift);

    webgl.drawArrays(webgl.TRIANGLE_FAN, 0, jsarray.length / 2);
    window.requestAnimationFrame(draw);
  }

  function stopstart() {
    start *= -1;
  }
}
