import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    onClick?: () => void;
}

export function Button({
    children,
    variant = "primary",
    className = "",
    onClick,
}: ButtonProps) {
    const baseClass = variant === "primary" ? "btn-primary" : "btn-secondary";
    return (
        <button className={`${baseClass} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}
