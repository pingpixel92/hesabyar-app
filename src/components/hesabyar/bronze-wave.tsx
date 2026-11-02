"use client";

// ─── حساب‌یار ─── موج برنز مذاب (پس‌زمینهٔ سینمایی WebGL) ───
// اقتباس آزاد از موج مایع «برنز و زمان»: موج‌های سینوسیِ بسیار آرام که
// در تم تیره مثل برنز مذاب روی مرکب می‌درخشند و در تم روشن به
// شامپاینیِ روی کاغذ کرم تبدیل می‌شوند. بدون هیچ کتابخانه‌ای — WebGL خام.

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTheme; // 0 = تیره / 1 = روشن

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  float time = uTime * 0.06; // نفس‌کشیدنِ بسیار آرام

  // پارامترهای ثابت موج — برای پایداری کامل
  float angle1 = 0.6;
  float angle2 = -0.7;
  float angle3 = 1.2;
  float freq1 = 2.4;
  float freq2 = 3.2;
  float freq3 = 4.0;

  vec2 warpedUv = uv;

  // اعوجاج نرم و گرد برای قوس‌های مورب
  warpedUv.x += sin(uv.y * 2.5 + time * 0.2) * 0.35;
  warpedUv.y += cos(uv.x * 2.5 - time * 0.15) * 0.35;
  warpedUv.x += sin(uv.y * 1.2 - time * 0.1) * 0.25;
  warpedUv.y += cos(uv.x * 1.2 + time * 0.18) * 0.25;

  // پارالاکس خیلی ملایم با حرکت موس
  warpedUv += vec2(uMouse.x * 0.05, uMouse.y * 0.05);

  vec2 dir1 = vec2(cos(angle1), sin(angle1));
  vec2 dir2 = vec2(cos(angle2), sin(angle2));
  vec2 dir3 = vec2(cos(angle3), sin(angle3));

  float w1 = sin(dot(warpedUv, dir1) * freq1 + time * 1.0);
  float w2 = cos(dot(warpedUv, dir2) * freq2 - time * 1.4 + w1 * 0.4);
  float w3 = sin(dot(warpedUv, dir3) * freq3 + time * 1.8 + w2 * 0.5);

  float waveField = w1 * 0.50 + w2 * 0.35 + w3 * 0.15;

  // درخشش فلزی: هالهٔ پهن + اسپکولار تیز
  float wideSheen = pow(max(0.0, 1.0 - abs(waveField - 0.1)), 2.5);
  float crispSpecular = pow(max(0.0, 1.0 - abs(waveField - 0.15)), 8.0);
  float crest = wideSheen * 0.5 + crispSpecular * 0.9;

  // پالت تیره: برنز مذاب روی مرکب گرم
  vec3 dShadow = vec3(0.047, 0.039, 0.027);
  vec3 dWave2  = vec3(0.075, 0.052, 0.028);
  vec3 dWave1  = vec3(0.130, 0.085, 0.040);
  vec3 dCrest  = vec3(0.753, 0.541, 0.243);

  // پالت روشن: شامپاینی روی کاغذ کرم
  vec3 lShadow = vec3(0.965, 0.957, 0.937);
  vec3 lWave2  = vec3(0.925, 0.905, 0.862);
  vec3 lWave1  = vec3(0.878, 0.843, 0.776);
  vec3 lCrest  = vec3(0.627, 0.416, 0.157);

  float t = smoothstep(0.0, 1.0, uTheme);
  vec3 colShadow = mix(dShadow, lShadow, t);
  vec3 colWave2  = mix(dWave2,  lWave2,  t);
  vec3 colWave1  = mix(dWave1,  lWave1,  t);
  vec3 colCrest  = mix(dCrest,  lCrest,  t);

  vec3 color = colShadow;
  color = mix(color, colWave2, smoothstep(-0.6, 0.2, waveField));
  color = mix(color, colWave1, smoothstep(0.0, 0.8, waveField));
  color += colCrest * crest * mix(0.16, 0.10, t);

  float vignette = 1.0 - dot(uv, uv) * mix(0.35, 0.18, t);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function BronzeWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const { resolvedTheme } = useTheme();
  // مقدار جاری تم بین بازسازی‌ها حفظ می‌شود تا گذار رنگ نرم بماند
  const themeCurRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vert || !frag || !program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    // مثلث تمام‌صفحه
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uTheme = gl.getUniformLocation(program, "uTheme");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    resize();
    window.addEventListener("resize", resize);

    // وضعیت هموارشده
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let themeTarget = resolvedTheme === "light" ? 1 : 0;
    let themeCur = themeCurRef.current;
    let raf = 0;
    let running = true;

    const onMouse = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const draw = (now: number) => {
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      themeCur += (themeTarget - themeCur) * 0.05;
      themeCurRef.current = themeCur;

      gl.uniform1f(uTime, now * 0.001);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouseX, -mouseY);
      gl.uniform1f(uTheme, themeCur);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      running = false;
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    if (reduced) {
      // یک فریم ثابت، بدون حلقه
      draw(10_000);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // با هر تغییر تم، شیدر با مقدار هدف جدید دوباره راه‌اندازی می‌شود
    // و چون themeCur در ref نگه داشته می‌شود، گذار رنگ نرم می‌ماند
  }, [resolvedTheme]);

  if (failed) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
