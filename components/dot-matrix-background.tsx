"use client";

import { useEffect, useRef } from "react";

export function DotMatrixBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            time += 0.003;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const spacing = 28;
            const cols = Math.ceil(canvas.width / spacing) + 1;
            const rows = Math.ceil(canvas.height / spacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;

                    // Organic wave pattern — like wind through grass
                    const wave1 = Math.sin(x * 0.008 + time * 0.8) * Math.cos(y * 0.006 + time * 0.5);
                    const wave2 = Math.sin((x + y) * 0.004 + time * 1.2) * 0.5;
                    const wave3 = Math.cos(x * 0.003 - y * 0.005 + time * 0.3) * 0.3;
                    const combined = (wave1 + wave2 + wave3) * 0.5 + 0.5;

                    const alpha = 0.03 + combined * 0.08;
                    const radius = 1 + combined * 0.8;

                    // Shift between green and gold tones
                    const green = 140 + Math.floor(combined * 40);
                    const red = 100 + Math.floor(combined * 60);
                    const blue = 90 + Math.floor(combined * 20);

                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                    ctx.fill();
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
            }}
            aria-hidden="true"
        />
    );
}
