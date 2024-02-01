import { Type } from "./Type.js";

/**
 * The IntegerType class extends the Type class to handle integers with specific bit sizes.
 * It supports both signed and unsigned integers, allowing for precise control over the integer's range.
 */
export class IntegerType extends Type {
    /**
     * Constructs an IntegerType instance.
     * 
     * @param {number} bitsNum The number of bits used to represent the integer.
     * @param {boolean} signed Indicates whether the integer is signed.
     */
    constructor(bitsNum = 52, signed = true) {
        super("number"); // Call the constructor of the base Type class with "number" as the type.
        this.bitsNum = bitsNum; // Store the number of bits for the integer representation.
        this.signed = signed; // Store whether the integer is signed.
        Object.freeze(this); // Freeze the instance to prevent further modifications.
    }

    /**
     * Verifies that a given value is a valid integer within the specified range and signedness.
     * 
     * @param {number} value The value to verify.
     * @throws {Error} If the value is not an integer or not within the specified range.
     */
    verify(value) {
        super.verify(value); // Ensure that the value is of type number.
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw new Error(`${value} is not an integer`);
        }
        if (!this.signed && value < 0) {
            throw new Error(`Unsigned ${value} should be non-negative`);
        }

        const max = this.signed ? Math.pow(2, this.bitsNum - 1) - 1 : Math.pow(2, this.bitsNum) - 1;
        const min = this.signed ? -Math.pow(2, this.bitsNum - 1) : 0;
        if (value > max || value < min) {
            throw new Error(`${value} is not in range [${min}, ${max}]`);
        }
    }

    /**
     * Returns a string representation of the IntegerType.
     * 
     * @returns {string} A string that represents the IntegerType configuration.
     */
    toString() {
        return `${this.signed ? 'int' : 'uInt'}${this.bitsNum}`;
    }

    /**
     * Encodes a given integer value based on the configured bitsNum and signedness.
     * 
     * @param {number} value The integer value to encode.
     * @param {function} write A callback function used to write the encoded value.
     */
    encode(value, write) {
        this.verify(value); // First, verify the value is within the expected range and type.
        if (this.signed) {
            write(value < 0 ? 1 : 0, 1); // Write the sign bit for signed integers.
            if (value < 0) {
                value = -value; // Convert value to positive for encoding.
            }
        }
        // Write the value within the specified number of bits, adjusting for the sign bit if necessary.
        write(value, this.bitsNum - (this.signed ? 1 : 0));
    }

    /**
     * Decodes a value from its binary representation based on the configured bitsNum and signedness.
     * 
     * @param {function} read A callback function used to read the binary representation.
     * @returns {number} The decoded integer value.
     */
    decode(read) {
        let isNegative = false;
        if (this.signed) {
            isNegative = read(1) === 1; // Determine if the value is negative from the sign bit.
        }
        let value = read(this.bitsNum - (this.signed ? 1 : 0)); // Read the integer value.
        if (this.signed && isNegative) {
            value = -value; // Apply the sign to the value if it's negative.
        }
        return value;
    }
}

Object.freeze(IntegerType); // Ensure the class definition cannot be modified at runtime.