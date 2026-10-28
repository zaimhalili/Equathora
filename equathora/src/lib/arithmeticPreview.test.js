import test from "node:test";
import assert from "node:assert/strict";
import { getArithmeticResult } from "./arithmeticPreview.js";

test("previews basic arithmetic", () => {
    assert.equal(getArithmeticResult("2 + 3 * 4"), "14");
    assert.equal(getArithmeticResult("(8 - 2) / 3"), "2");
    assert.equal(getArithmeticResult("2^3"), "8");
    assert.equal(getArithmeticResult("2 xx 5"), "10");
});

test("does not preview variables, functions, non-finite results, or plain numbers", () => {
    assert.equal(getArithmeticResult("x + 2"), null);
    assert.equal(getArithmeticResult("sqrt(9)"), null);
    assert.equal(getArithmeticResult("1 / 0"), null);
    assert.equal(getArithmeticResult("42"), null);
});
