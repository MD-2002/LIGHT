    const canvas = document.querySelector(`canvas`);
    const webgl = canvas.getContext(`webgl2`);
    const vsSource =`#version 300 es   
        void main() { gl_Position = vec4(0.5,0.5,0,1);
        gl_PointSize=50.0;
    }`
    const fsSource = `#version 300 es
    precision mediump float;
    out vec4 fragColour;
    void main() { fragColour = vec4(1.0,0,0,1.0); }`;
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, vsSource ); 
    webgl.compileShader(vertexShader);
   
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, fsSource);
    webgl.compileShader(fragmentShader);
    if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
        alert(webgl.getShaderInfoLog(fragmentShader));
    }
    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    webgl.useProgram(program);
    webgl.drawArrays(webgl.POINTS, 0, 1);