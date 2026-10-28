import React from "react";
import "./../pages/PageNotFound.css";

export default function ErrorFallback() {
    return (
        <main className="page-not-found theme-lock">
            <div className="not-found-content">
                <div className="error-code">Oops!</div>
                <h1 className="error-title">Something went wrong</h1>
                <p className="error-message">
                    The page ran into a problem and could not be displayed. Please try again.
                    If you continue to have trouble, contact me at{" "}
                    <a href="mailto:equathora@gmail.com">equathora@gmail.com</a>.
                </p>
                <div className="error-actions">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                    <a href="/" className="btn-secondary">
                        Go to Home
                    </a>
                </div>
            </div>
        </main>
    );
}
