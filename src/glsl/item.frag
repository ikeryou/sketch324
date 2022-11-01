uniform vec3 defColor;
uniform vec3 color;
uniform float rate;

varying vec2 vUv;

void main(void) {
  vec3 dest = mix(defColor, color, rate);
  gl_FragColor = vec4(dest, 1.0);
}
