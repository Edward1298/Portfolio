import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

// WebGL fragment-shader fog — dark storm-tuned palette, FBM noise.
// Sits behind the lightning canvas (z 0 vs lightning z 1). Canvas is
// position:fixed (viewport-sized, efficient) but the shader displaces
// its noise coords by window.scrollY — so the fog visually scrolls with
// the page like it's part of the document flow, without the GPU cost of
// a document-sized canvas. Fog drifts even under reduced-motion (ambient,
// non-flashy); lightning is still omitted under reduced-motion.
const VERT_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// FBM octaves are inlined as a compile-time constant via OCTAVES define
// (injected per-breakpoint so mobile compiles a lighter shader).
function fragSrc(octaves) {
  return `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_scroll;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < ${octaves}; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv.x *= u_resolution.x / u_resolution.y;
      // Parallax scroll — fog drifts at half the page scroll speed (gentle,
      // less nauseating than near-1:1 where small sync errors read as jitter).
      uv.y += u_scroll * 0.5;

      vec2 q = vec2(0.0);
      q.x = fbm(uv + 0.07 * u_time);
      q.y = fbm(uv + vec2(1.0, 1.0));

      vec2 r = vec2(0.0);
      r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
      r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

      float f = fbm(uv + r);

      // Dark storm palette — night-storm theme, tinted toward #5B8FFF
      // Midpoint between the first pass (too bright) and the dark pass (too dim).
      vec3 baseColor = vec3(0.02, 0.02, 0.04);
      vec3 mistColor = vec3(0.14, 0.17, 0.25);
      vec3 accentColor = vec3(0.15, 0.20, 0.30);

      vec3 color = mix(baseColor, mistColor, f);
      color = mix(color, accentColor, dot(q, r) * 0.5);

      // Mild lift, kept dark
      color = pow(color, vec3(1.06)) * 1.28;
      gl_FragColor = vec4(color, 1.0);
    }
  `
}

export default function FogBackground() {
  const canvasRef = useRef(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const compileShader = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const program = gl.createProgram()
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, VERT_SRC))
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragSrc(isDesktop ? 6 : 4)))
    gl.linkProgram(program)
    gl.useProgram(program)

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const posAttrib = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posAttrib)
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0)

    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    const scrollLoc = gl.getUniformLocation(program, 'u_scroll')

    // Half-res render + CSS upscale — fog is blurry, full-res is wasted GPU.
    const dpr = Math.min(window.devicePixelRatio || 1, 1)
    const SCALE = 0.5

    function resize() {
      const w = Math.floor(window.innerWidth * SCALE * dpr)
      const h = Math.floor(window.innerHeight * SCALE * dpr)
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
    resize()

    // Fog keeps its gentle ambient drift even under prefers-reduced-motion —
    // deliberate exception: the drift is slow/ambient (not the flashy motion
    // that triggers vestibular issues), and the fog is the site's atmospheric
    // base. Lightning is still fully omitted under reduced-motion.
    let animId = null
    let started = false
    window.addEventListener('resize', resize)

    function render(time) {
      gl.uniform1f(timeLoc, time * 0.001)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      // Normalized scroll — fog displaces 1:1 with the page
      gl.uniform1f(scrollLoc, window.scrollY / window.innerHeight)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animId = requestAnimationFrame(render)
    }

    function startLoop() {
      if (!started) {
        started = true
        animId = requestAnimationFrame(render)
      }
    }

    // Pause when tab hidden — cheap insurance for the second rAF loop.
    function onVisibility() {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId)
          animId = null
        }
      } else if (started && !animId) {
        animId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Lazy-init on #landing — matches LightningBackground (masterPlan 2.2).
    // Fog stays site-wide once started (decision #2), but doesn't spin up
    // before the landing section is visible.
    let observer = null
    const target = document.getElementById('landing')
    if (!target) {
      startLoop()
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startLoop()
            observer.disconnect()
          }
        },
        { threshold: 0 }
      )
      observer.observe(target)
    }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      if (observer) observer.disconnect()
    }
  }, [isDesktop])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
