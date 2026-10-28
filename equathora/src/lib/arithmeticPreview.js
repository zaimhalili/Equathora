import { parse } from "mathjs";

const MAX_EXPRESSION_LENGTH = 150;
const ALLOWED_OPERATORS = new Set(["+", "-", "*", "/", "^", "%"]);

const isArithmeticNode = (node) => {
    if (node.isParenthesisNode) {
        return isArithmeticNode(node.content);
    }

    if (node.isConstantNode) {
        return typeof node.value === "number" && Number.isFinite(node.value);
    }

    if (node.isOperatorNode) {
        return ALLOWED_OPERATORS.has(node.op) && node.args.every(isArithmeticNode);
    }

    return false;
};

export function getArithmeticResult(expression) {
    if (typeof expression !== "string" || expression.trim() === "" || expression.length > MAX_EXPRESSION_LENGTH) {
        return null;
    }

    const normalizedExpression = expression
        .replace(/-:/g, "/")
        .replace(/[×·]/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/\bxx\b/g, "*");

    try {
        const parsed = parse(normalizedExpression);
        if (!isArithmeticNode(parsed) || parsed.filter((node) => node.isOperatorNode).length === 0) {
            return null;
        }

        const result = parsed.evaluate();
        if (typeof result !== "number" || !Number.isFinite(result)) {
            return null;
        }

        return Number((Object.is(result, -0) ? 0 : result).toPrecision(8)).toString();
    } catch {
        return null;
    }
}
