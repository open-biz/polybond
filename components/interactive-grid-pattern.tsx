"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface InteractiveGridPatternProps {
    className?: string;
    width?: number;
    height?: number;
}

export function InteractiveGridPattern({
    className = "",
    width = 32,
    height = 32,
}: InteractiveGridPatternProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    const cols = Math.ceil(1920 / width);
    const rows = Math.ceil(1080 / height);

    const dots = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const cx = i * width + width / 2;
            const cy = j * height + height / 2;
            const dx = mousePos.x - cx;
            const dy = mousePos.y - cy;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;
            const opacity = distance < maxDistance ? 0.08 + (1 - distance / maxDistance) * 0.25 : 0.03;
            const scale = distance < maxDistance ? 1 + (1 - distance / maxDistance) * 1.5 : 1;

            dots.push(
                <circle
                    key={`${i}-${j}`}
                    cx={cx}
                    cy={cy}
                    r={1 * scale}
                    fill="currentColor"
                    opacity={opacity}
                    style={{ transition: "opacity 0.3s ease, r 0.3s ease" }}
                />
            );
        }
    }

    return (
        <svg
            ref={svgRef}
            className={className}
            width="100%"
            height="100%"
            style={{ pointerEvents: "none" }}
            aria-hidden="true"
        >
            {dots}
        </svg>
    );
}
