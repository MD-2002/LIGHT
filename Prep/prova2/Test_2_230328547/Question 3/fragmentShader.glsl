precision mediump float;
    varying vec2 fragtexture;
    uniform sampler2D fragsampler;
    void main() {
        gl_FragColor = texture2D(fragsampler, fragtexture);
    }