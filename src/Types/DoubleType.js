import { Type } from "./Type.js";

/**
 * The DoubleType class extends the Type class to handle double-precision
 * floating-point numbers. It provides methods to encode, decode, and verify
 * values as 64-bit double precision floats (following the IEEE 754 standard).
 */
export class DoubleType extends Type {
    /**
     * Constructs a DoubleType instance.
     */
    constructor() {
        super("number");
    }

    // Raw implementation of encoding and decoding for future reference
    // Uncomment and utilize as needed for a more detailed handling of double-precision floating-point numbers.

    // verify(value) {
    //     super.verify(value);
    //     // Check if the value can be accurately represented as a 64-bit double precision float
    //     if (isNaN(value) || !isFinite(value)) {
    //         throw `${value} is not a finite double`;
    //     }
    //     // Extract the components of the IEEE 754 double-precision format
    //     const binaryRepresentation = new Float64Array([value]);
    //     const doubleValue = binaryRepresentation[0];
    //     const signBit = (doubleValue >> 63) & 1;
    //     const exponent = ((doubleValue >> 52) & 0x7FF) - 1023; // IEEE 754 bias is 1023
    //     const significand = (doubleValue & 0xFFFFFFFFFFFFF) / (1 << 52); // 52 bits in significand
    //     // Check if it's within the range of a 64-bit double
    //     if (exponent > 1023 || exponent < -1022 || significand > 1 || significand < 0) {
    //         throw `${value} is not representable as a 64-bit double`;
    //     }
    // }

    // encode(value, write) {
    //     this.verify(value);
    //     const binaryRepresentation = new Float64Array([value]);
    //     const doubleValue = binaryRepresentation[0];
    //     const signBit = (doubleValue >> 63) & 1;
    //     const exponent = ((doubleValue >> 52) & 0x7FF) - 1023; // IEEE 754 bias is 1023
    //     const significand = (doubleValue & 0xFFFFFFFFFFFFF) / (1 << 52); // 52 bits in significand
    //     // Write the sign bit
    //     write(signBit, 1);
    //     // Write the exponent
    //     write(exponent, 11);
    //     // Write the significand
    //     write(significand, 52);
    // }

    // decode(read) {
    //     const signBit = read(1);
    //     const exponent = read(11);
    //     const significand = read(52);
    //     // Reconstruct the 64-bit double
    //     const doubleValue = (signBit << 63) | ((exponent + 1023) << 52) | (significand << 0);
    //     const binaryRepresentation = new Float64Array([doubleValue]);
    //     return binaryRepresentation[0];
    // }
    
    // Current implementation using JavaScript's built-in typed array methods for encoding and decoding

    /**
     * Encodes a double-precision floating-point number using JavaScript's built-in typed array methods.
     * 
     * @param {number} value - The double value to be encoded.
     * @param {function} write - A function to write the encoded double value.
     */
    encode(value, write) {
        this.verify(value);
        const binaryRepresentation = new Float64Array([value]);
        const doubleValue = binaryRepresentation[0];
        write(doubleValue, 64);
    }

    /**
     * Decodes a 64-bit binary format into a double-precision floating-point number.
     * 
     * @param {function} read - A function to read the double value from the binary format.
     * @returns {number} - The decoded double value.
     */
    decode(read) {
        const doubleValue = read(64);
        const binaryRepresentation = new Float64Array([doubleValue]);
        return binaryRepresentation[0];
    }

    /**
     * Verifies that a value is a finite double using JavaScript's built-in typed array methods.
     * Throws an error if the value is not a finite double.
     * 
     * @param {number} value - The value to be verified.
     * @throws {Error} - Throws an error if the value is not a finite double.
     */
    verify(value) {
        super.verify(value);
        if (isNaN(value) || !isFinite(value)) {
            throw new Error(`${value} is not a finite double`);
        }
        const binaryRepresentation = new Float64Array([value]);
        const floatValue = binaryRepresentation[0];
        if (!Number.isFinite(floatValue) || Number.isNaN(floatValue)) {
            throw new Error(`${value} does not have a valid 64-bit representation`);
        }
    }
}

// Freezes the DoubleType class to prevent modification
Object.freeze(DoubleType);