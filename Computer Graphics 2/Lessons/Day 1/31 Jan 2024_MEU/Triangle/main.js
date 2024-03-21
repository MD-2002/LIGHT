    const canvas = document.querySelector(`canvas`);
    const webgl = canvas.getContext(`webgl`);

    if(!webgl){ throw new Error("WebGL not available/supported");}

    webgl.clearColor(1.0,1.0,0,1); //r=0 g=1 b=0 values red green blue 1 0 ; rgba
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    const vertices = new Float32Array([
        0,0, -1,-1,  -1,0,
        -1,1, 0,1, 1,1, 1,0
    ]);

    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

    const vsSource =`     
    attribute vec2 pos;
    void main() { gl_Position = vec4(pos,0,1); }`
    const fsSource = `
    void main() { gl_FragColor = vec4(1.0,0,0,1.0); }`;

    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, vsSource ); 
    webgl.compileShader(vertexShader);
   
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, fsSource);
    webgl.compileShader(fragmentShader);
   
    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    
    const positionLocation = webgl.getAttribLocation(program, `pos`);
    webgl.enableVertexAttribArray(positionLocation);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
    //webgl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    webgl.useProgram(program);
    //webgl.drawArrays(webgl.TRIANGLES, 0, 3);    
    //webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 7);    
    webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 7);