"use client";

import { useEffect, useRef } from "react";

export default function AmbientBackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface DotNode {
      gx: number;
      gy: number;
      radius: number;
      phase: number;
      speed: number;
      orbitRadius: number;
      alpha: number;
    }

    let dots: DotNode[] = [];
    const spacing = 38;

    const buildGrid = () => {
      width = canvas.width = document.documentElement.clientWidth || window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = [];

      let idx = 0;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const pseudoRand = seed - Math.floor(seed);

          let radius = 1.2;
          let alpha = 0.7;
          if (pseudoRand > 0.82) {
            radius = 2.6;
            alpha = 1.0;
          } else if (pseudoRand > 0.5) {
            radius = 1.7;
            alpha = 0.85;
          } else if (pseudoRand < 0.2) {
            radius = 0.9;
            alpha = 0.5;
          }

          dots.push({
            gx: x,
            gy: y,
            radius,
            phase: pseudoRand * Math.PI * 2,
            speed: 0.0006 + pseudoRand * 0.0008,
            orbitRadius: 2.0 + pseudoRand * 3.0,
            alpha,
          });
          idx++;
        }
      }
    };

    buildGrid();
    window.addEventListener("resize", buildGrid);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let shockwave = { x: -1000, y: -1000, radius: 0, active: false };
    const handleClick = (e: MouseEvent) => {
      shockwave = { x: e.clientX, y: e.clientY, radius: 0, active: true };
    };
    window.addEventListener("click", handleClick, { passive: true });

    const pullRadius = 120;
    const maxPull = 16;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const baseRgb = isDark ? "250, 250, 250" : "15, 15, 20";
      const gridLineColor = isDark ? "rgba(255, 255, 255, 0.015)" : "rgba(0, 0, 0, 0.018)";
      const time = Date.now();

      // Draw subtle ambient grid lines (extremely faint)
      ctx.strokeStyle = gridLineColor;
      ctx.lineWidth = 1;
      const gridStep = 56;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (shockwave.active) {
        shockwave.radius += 14;
        if (shockwave.radius > 400) {
          shockwave.active = false;
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        const ambientX = dot.gx + Math.cos(time * dot.speed + dot.phase) * dot.orbitRadius;
        const ambientY = dot.gy + Math.sin(time * dot.speed * 1.2 + dot.phase) * dot.orbitRadius;

        let drawX = ambientX;
        let drawY = ambientY;

        const dx = mouse.x - ambientX;
        const dy = mouse.y - ambientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pullRadius) {
          const force = (1 - dist / pullRadius) * maxPull;
          const angle = Math.atan2(dy, dx);
          drawX += Math.cos(angle) * force;
          drawY += Math.sin(angle) * force;
        }

        if (shockwave.active) {
          const sdx = shockwave.x - ambientX;
          const sdy = shockwave.y - ambientY;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          const diff = Math.abs(sdist - shockwave.radius);
          if (diff < 45) {
            const waveForce = (1 - diff / 45) * 18;
            const sangle = Math.atan2(sdy, sdx);
            drawX -= Math.cos(sangle) * waveForce;
            drawY -= Math.sin(sangle) * waveForce;
          }
        }

        ctx.fillStyle = `rgba(${baseRgb}, ${dot.alpha * 0.14})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

