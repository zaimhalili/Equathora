import React from "react";

export default function MathLiveCalculator({ result }) {
    if (result == null) return null;

    return (
        <output
            className="ml-calculator-result"
            aria-label={`Calculated result: ${result}`}
            title={`Calculated result: ${result}`}
        >
            = {result}
        </output>
    );
}
