/**
 * @license Complex.js v2.1.1 12/05/2020
 *
 * Copyright (c) 2020, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
/**
 *
 * This class allows the manipulation of complex numbers.
 * You can pass a complex number in different formats. Either as object, double, string or two integer parameters.
 *
 * Object form
 * { re: <real>, im: <imaginary> }
 * { arg: <angle>, abs: <radius> }
 * { phi: <angle>, r: <radius> }
 *
 * Array / Vector form
 * [ real, imaginary ]
 *
 * Double form
 * 99.3 - Single double value
 *
 * String form
 * '23.1337' - Simple real number
 * '15+3i' - a simple complex number
 * '3-i' - a simple complex number
 *
 * Example:
 *
 * var c = new Complex('99.3+8i');
 * c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
 *
 */
type AValue = Complex | {
    im: number;
    re: number;
} | {
    abs: number;
    arg: number;
} | {
    r: number;
    phi: number;
} | [number, number] | string | number | null | undefined;
/**
 * @constructor
 * @returns {Complex}
 */
export declare class Complex {
    re: number;
    im: number;
    constructor(a: any, b?: any);
    /**
     * Calculates the sign of a complex number, which is a normalized complex
     *
     * @returns {Complex}
     */
    sign(): Complex;
    /**
     * Adds two complex numbers
     *
     * @returns {Complex}
     */
    add(a: AValue, b?: AValue): any;
    /**
     * Subtracts two complex numbers
     *
     * @returns {Complex}
     */
    sub(a: AValue, b?: AValue): any;
    /**
     * Multiplies two complex numbers
     *
     * @returns {Complex}
     */
    mul(a: AValue, b?: AValue): any;
    /**
     * Divides two complex numbers
     *
     * @returns {Complex}
     */
    div(a: AValue, b?: AValue): any;
    /**
     * Calculate the power of two complex numbers
     *
     * @returns {Complex}
     */
    pow(a: AValue, b?: AValue): any;
    /**
     * Calculate the complex square root
     *
     * @returns {Complex}
     */
    sqrt(): Complex;
    /**
     * Calculate the complex exponent
     *
     * @returns {Complex}
     */
    exp(): Complex;
    /**
     * Calculate the complex exponent and subtracts one.
     *
     * This may be more accurate than `Complex(x).exp().sub(1)` if
     * `x` is small.
     *
     * @returns {Complex}
     */
    expm1(): Complex;
    /**
     * Calculate the natural log
     *
     * @returns {Complex}
     */
    log(): Complex;
    /**
     * Calculate the magnitude of the complex number
     *
     * @returns {number}
     */
    abs(): number;
    /**
     * Calculate the angle of the complex number
     *
     * @returns {number}
     */
    arg(): number;
    /**
     * Calculate the sine of the complex number
     *
     * @returns {Complex}
     */
    sin(): Complex;
    /**
     * Calculate the cosine
     *
     * @returns {Complex}
     */
    cos(): Complex;
    /**
     * Calculate the tangent
     *
     * @returns {Complex}
     */
    tan(): Complex;
    /**
     * Calculate the cotangent
     *
     * @returns {Complex}
     */
    cot(): Complex;
    /**
     * Calculate the secant
     *
     * @returns {Complex}
     */
    sec(): Complex;
    /**
     * Calculate the cosecans
     *
     * @returns {Complex}
     */
    csc(): Complex;
    /**
     * Calculate the complex arcus sinus
     *
     * @returns {Complex}
     */
    asin(): Complex;
    /**
     * Calculate the complex arcus cosinus
     *
     * @returns {Complex}
     */
    acos(): Complex;
    /**
     * Calculate the complex arcus tangent
     *
     * @returns {Complex}
     */
    atan(): Complex;
    /**
     * Calculate the complex arcus cotangent
     *
     * @returns {Complex}
     */
    acot(): Complex;
    /**
     * Calculate the complex arcus secant
     *
     * @returns {Complex}
     */
    asec(): Complex;
    /**
     * Calculate the complex arcus cosecans
     *
     * @returns {Complex}
     */
    acsc(): Complex;
    /**
     * Calculate the complex sinh
     *
     * @returns {Complex}
     */
    sinh(): Complex;
    /**
     * Calculate the complex cosh
     *
     * @returns {Complex}
     */
    cosh(): Complex;
    /**
     * Calculate the complex tanh
     *
     * @returns {Complex}
     */
    tanh(): Complex;
    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    coth(): Complex;
    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    csch(): Complex;
    /**
     * Calculate the complex sech
     *
     * @returns {Complex}
     */
    sech(): Complex;
    /**
     * Calculate the complex asinh
     *
     * @returns {Complex}
     */
    asinh(): Complex;
    /**
     * Calculate the complex acosh
     *
     * @returns {Complex}
     */
    acosh(): Complex;
    /**
     * Calculate the complex atanh
     *
     * @returns {Complex}
     */
    atanh(): Complex;
    /**
     * Calculate the complex acoth
     *
     * @returns {Complex}
     */
    acoth(): Complex;
    /**
     * Calculate the complex acsch
     *
     * @returns {Complex}
     */
    acsch(): Complex;
    /**
     * Calculate the complex asech
     *
     * @returns {Complex}
     */
    asech(): any;
    /**
     * Calculate the complex inverse 1/z
     *
     * @returns {Complex}
     */
    inverse(): any;
    /**
     * Returns the complex conjugate
     *
     * @returns {Complex}
     */
    conjugate(): Complex;
    /**
     * Gets the negated complex number
     *
     * @returns {Complex}
     */
    neg(): Complex;
    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    ceil(places: any): Complex;
    /**
     * Floors the actual complex number
     *
     * @returns {Complex}
     */
    floor(places: any): Complex;
    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    round(places: any): Complex;
    /**
     * Compares two complex numbers
     *
     * **Note:** new Complex(Infinity).equals(Infinity) === false
     *
     * @returns {boolean}
     */
    equals(a: any, b: any): boolean;
    /**
     * Clones the actual object
     *
     * @returns {Complex}
     */
    clone(): Complex;
    /**
     * Gets a string of the actual complex number
     *
     * @returns {string}
     */
    toString(): string;
    /**
     * Returns the actual number as a vector
     *
     * @returns {Array}
     */
    toVector(): number[];
    /**
     * Returns the actual real value of the current object
     *
     * @returns {number|null}
     */
    valueOf(): number | null;
    /**
     * Determines whether a complex number is not on the Riemann sphere.
     *
     * @returns {boolean}
     */
    isNaN(): boolean;
    /**
     * Determines whether or not a complex number is at the zero pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    isZero(): boolean;
    /**
     * Determines whether a complex number is not at the infinity pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    isFinite(): boolean;
    /**
     * Determines whether or not a complex number is at the infinity pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    isInfinite(): boolean;
}
export {};
