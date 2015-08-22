// The MIT License (MIT)

// Copyright (c) 2015 Wesley LaFerriere

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "GLSL-CRT"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#ifdef GL_ES
#define LOWP lowp
    precision mediump float;
#else
    #define LOWP
#endif

uniform float CRT_CURVE_AMNTx; // curve amount on x
uniform float CRT_CURVE_AMNTy; // curve amount on y
#define CRT_CASE_BORDR 0.0125
#define SCAN_LINE_MULT 1250.0

varying LOWP vec4 v_color;
varying vec2 v_texCoords;

uniform sampler2D u_texture;

void main() {
	vec2 tc = vec2(v_texCoords.x, v_texCoords.y);

	// Distance from the center
	float dx = abs(0.5-tc.x);
	float dy = abs(0.5-tc.y);

	// Square it to smooth the edges
	dx *= dx;
	dy *= dy;

	tc.x -= 0.5;
	tc.x *= 1.0 + (dy * CRT_CURVE_AMNTx);
	tc.x += 0.5;

	tc.y -= 0.5;
	tc.y *= 1.0 + (dx * CRT_CURVE_AMNTy);
	tc.y += 0.5;

	// Get texel, and add in scanline if need be
	vec4 cta = texture2D(u_texture, vec2(tc.x, tc.y));

	cta.rgb += sin(tc.y * SCAN_LINE_MULT) * 0.02;

	// Cutoff
	if(tc.y > 1.0 || tc.x < 0.0 || tc.x > 1.0 || tc.y < 0.0)
		cta = vec4(0.0);

	// Apply
	gl_FragColor = cta * v_color;
}
