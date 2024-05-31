attribute vec3 pos;
attribute vec3 colour;
varying vec3 vcolour;
uniform mat4 model;

void main() { 
    vcolour = colour;
    gl_Position = model * vec4(pos, 1);
}
