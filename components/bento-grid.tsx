import { ReactNode } from "react";
import Link from "next/link";
import styles from "./bento-grid.module.css";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
    return (
        <div className={`${styles.grid} ${className}`}>
            {children}
        </div>
    );
}

interface BentoCardProps {
    icon: ReactNode;
    name: string;
    description: string;
    cta?: string;
    href?: string;
    background?: ReactNode;
    className?: string;
    colSpan?: 1 | 2;
}

export function BentoCard({
    icon,
    name,
    description,
    cta,
    href,
    background,
    className = "",
    colSpan = 1,
}: BentoCardProps) {
    return (
        <div
            className={`${styles.card} ${colSpan === 2 ? styles.cardWide : ""} ${className}`}
        >
            {background && (
                <div className={styles.background}>{background}</div>
            )}
            <div className={styles.content}>
                <div className={styles.iconWrap}>{icon}</div>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.description}>{description}</p>
                {cta && (
                    <Link href={href || "#"} className={styles.cta}>
                        {cta}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    );
}
