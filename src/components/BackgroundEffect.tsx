"use client";

import type React from "react";
import { useEffect, useRef } from "react";

const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Star[] = [];
    const pokeballs: Pokeball[] = [];

    class Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2;
        this.twinkleSpeed = 0.05 + Math.random() * 0.05;
      }

      draw(opacity: number) {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Pokeball {
      x: number;
      y: number;
      size: number;
      speed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = 5 + Math.random() * 10;
        this.speed = 0.2 + Math.random() * 0.5;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height + this.size) {
          this.y = -this.size;
          this.x = Math.random() * canvas!.width;
        }
      }
    }

    for (let i = 0; i < 100; i++) {
      stars.push(new Star());
    }

    for (let i = 0; i < 10; i++) {
      pokeballs.push(new Pokeball());
    }

    let opacity = 0;
    let increasing = true;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (increasing) {
        opacity += 0.01;
        if (opacity >= 1) increasing = false;
      } else {
        opacity -= 0.01;
        if (opacity <= 0) increasing = true;
      }

      stars.forEach((star) => star.draw(opacity));
      pokeballs.forEach((pokeball) => {
        pokeball.draw();
        pokeball.update();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 h-full w-full"
    />
  );
};

export default BackgroundEffects;
