   precision mediump float;
    attribute vec2 vtexture ;
    varying vec2 fragtexture;
    attribute vec3 pos;
    uniform mat4 matrix;

    void main(){
        gl_Position =matrix*vec4(pos,1);
        fragtexture = vtexture;
    }