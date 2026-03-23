"use client";

import { useState } from "react";
import styles from "./waitlist-form.module.css";

export function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 800);
    };

    if (submitted) {
        return (
            <div className={styles.success}>
                <span className={styles.successIcon}>✓</span>
                <p className={styles.successText}>
                    You&apos;re on the list. We&apos;ll be in touch.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={styles.input}
                    required
                />
                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? (
                        <span className={styles.spinner} />
                    ) : (
                        "Join Waitlist"
                    )}
                </button>
            </div>
            <p className={styles.hint}>No spam. Early access only.</p>
        </form>
    );
}
