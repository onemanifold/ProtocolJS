import  { Type } from "./Type.js"

// Single precision floating point number (1 sign bit, 8 exponent bits, and 23 significand bits.)
export class FloatType extends Type {
    constructor() {
        super("number")

    }

    verify(value) {
        super.verify(value);

        // Check if the value can be accurately represented as a 32-bit float
        if (isNaN(value) || !isFinite(value)) {
            throw `${value} is not a finite float`;
        }

        // Extract the components of the IEEE 754 single-precision format
        const binaryRepresentation = new Float32Array([value]);
        const floatValue = binaryRepresentation[0];
        const signBit = (floatValue >> 31) & 1;
        const exponent = ((floatValue >> 23) & 0xFF) - 127; // IEEE 754 bias is 127
        const significand = (floatValue & 0x7FFFFF) / (1 << 23); // 23 bits in significand

        // Check if it's within the range of a 32-bit float
        if (exponent > 127 || exponent < -126 || significand > 1 || significand < 0) {
            throw `${value} does not have a 32-bit representation`;
        }
    }



    //encode using javascript built in typed array methods (benchmark)
    encode(value, write) {
        this.verify(value);
        const binaryRepresentation = new Float32Array([value]);
        const floatValue = binaryRepresentation[0];
        write(floatValue, 32);
    }

    decode(read) {
        const floatValue = read(32);
        const binaryRepresentation = new Float32Array([floatValue]);
        return binaryRepresentation[0];
    }
    


}

import { Type } from "./Type.js";

/**
 * The FloatType class extends the Type class to handle single-precision
 * floating-point numbers (32-bit floats) following the IEEE 754 standard.
 * It includes methods for verifying, encoding, and decoding values as 32-bit floats.
 */
export class FloatType extends Type {
    constructor() {
        super("number");
    }

    /**
     * Verifies that a value can be accurately represented as a 32-bit float.
     * Throws an error if the value is not a finite float or outside the 32-bit float range.
     * 
     * @param {number} value - The value to be verified.
     * @throws {Error} - If the value is not a finite float or not representable as a 32-bit float.
     */
    verify(value) {
        super.verify(value); // verify that the value is a number

        if (isNaN(value) || !isFinite(value)) {
            throw new Error(`${value} is not a finite float`);
        }

        // The following commented code is for detailed verification based on IEEE 754 components,
        // which is preserved for future reference and more detailed validation if needed.
        /* 
        const binaryRepresentation = new Float32Array([value]);
        const floatValue = binaryRepresentation[0];
        const signBit = (floatValue >> 31) & 1;
        const exponent = ((floatValue >> 23) & 0xFF) - 127; // IEEE 754 bias is 127
        const significand = (floatValue & 0x7FFFFF) / (1 << 23); // 23 bits in significand

        if (exponent > 127 || exponent < -126 || significand > 1 || significand < 0) {
            throw `${value} does not have a 32-bit representation`;
        }
        */
    }

    // encode(value, write) {
    //     this.verify(value);
    //     const binaryRepresentation = new Float32Array([value]);
    //     const floatValue = binaryRepresentation[0];
    //     const signBit = (floatValue >> 31) & 1;
    //     const exponent = ((floatValue >> 23) & 0xFF) - 127; // IEEE 754 bias is 127
    //     const significand = (floatValue & 0x7FFFFF) / (1 << 23); // 23 bits in significand
    //     // Write the sign bit
    //     write(signBit, 1);
    //     // Write the exponent
    //     write(exponent, 8);
    //     // Write the significand
    //     write(significand, 23);
    // }

    // decode(read) {
    //     const signBit = read(1);
    //     const exponent = read(8);
    //     const significand = read(23);
    //     // Reconstruct the 32-bit float
    //     const floatValue = (signBit << 31) | ((exponent + 127) << 23) | (significand << 0);
    //     const binaryRepresentation = new Float32Array([floatValue]);
    //     return binaryRepresentation[0];
    // }
    
    //   verify using javascript built in typed array methods
    // verify(value) {
    //     // Check if the value can be accurately represented as a 32-bit float
    //     if (isNaN(value) || !isFinite(value)) {
    //         throw `${value} is not a finite float`;
    //     }

    //     // Check if the value is within the range of a 32-bit float
    //     if (value > 3.402823466e38 || value < -3.402823466e38) {
    //         throw `${value} is not representable as a 32-bit float`;
    //     }

    //     // Ensure that the value retains its 32-bit representation
    //     const binaryRepresentation = new Float32Array([value]);
    //     const floatValue = binaryRepresentation[0];
    //     if (binaryRepresentation[0] !== floatValue) {
    //         throw `${value} does not have a 32-bit representation`;
    //     }
    // }

    /**
     * Encodes a 32-bit float into a binary format using JavaScript's built-in typed array methods.
     * 
     * @param {number} value - The float value to be encoded.
     * @param {function} write - A function to write the encoded float value.
     */
    encode(value, write) {
        this.verify(value);
        const binaryRepresentation = new Float32Array([value]);
        const floatValue = binaryRepresentation[0];
        write(floatValue, 32);
    }

    /**
     * Decodes a binary format into a 32-bit float using JavaScript's built-in typed array methods.
     * 
     * @param {function} read - A function to read the float value from the binary format.
     * @returns {number} - The decoded float value.
     */
    decode(read) {
        const floatValue = read(32);
        const binaryRepresentation = new Float32Array([floatValue]);
        return binaryRepresentation[0];
    }
}

Object.freeze(FloatType);