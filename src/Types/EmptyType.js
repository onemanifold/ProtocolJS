import { Type } from "./Type.js";

/**
 * The EmptyType class extends the Type class to specifically handle and enforce emptiness.
 * It provides methods to verify that a value is considered empty, and to encode and decode such values.
 * Emptiness is defined as being either undefined, null, an empty string, or an empty array.
 */
export class EmptyType extends Type {
    /**
     * Verifies that a given value is empty according to the criteria of undefined, null, empty string, or empty array.
     * Throws an error if the value is not empty.
     * 
     * @param {*} value - The value to be verified.
     * @throws {Error} - Throws an error if the value is not considered empty.
     * @returns {*} - The original value if it is considered empty.
     */
    verify(value) {
        // Checks if value is not undefined, not null, not an empty string, and not an empty array
        if (value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
            throw new Error(`Value "${value}" is not empty.`);
        }
        return value;
    }

    /**
     * Encodes an empty value. Since the value is empty, this method simply verifies the emptiness
     * without writing anything to the output.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value (unused in this case).
     */
    encode(value, write) {
        this.verify(value); // Verify the value is empty; no actual encoding is needed for emptiness
    }

    /**
     * Decodes a value and returns undefined, representing the concept of emptiness.
     * 
     * @param {function} read - A function to read the value from the input (unused in this case).
     * @returns {undefined} - Returns undefined to represent an empty value.
     */
    decode(read) {
        return undefined; // Always returns undefined as the representation of emptiness
    }
}

Object.freeze(EmptyType);