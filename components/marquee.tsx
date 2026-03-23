"use client";

import { useEffect, useRef, ReactNode } from "react";
import styles from "./marquee.module.css";

interface MarqueeProps {
    children: ReactNode;
    pauseOnHover?: boolean;
    direction?: "left" | "right";
    speed?: number;
    className?: string;
}

export function Marquee({
    children,
    pauseOnHover = true,
    direction = "left",
    speed = 30,
    className = "",
}: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.style.setProperty("--marquee-duration", `${speed}s`);
    }, [speed]);

    return (
        <div
            ref={containerRef}
            className={`${styles.marquee} ${pauseOnHover ? styles.pauseOnHover : ""} ${className}`}
        >
            <div
                className={styles.track}
                style={{ animationDirection: direction === "right" ? "reverse" : "normal" }}
            >
                {children}
                {children}
            </div>
        </div>
    );
}
