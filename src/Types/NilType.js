import { Type } from "./Type.js";

/**
 * The NilType class extends the Type class to handle and enforce the concept of 'null' values.
 * It provides methods to verify that a value is null, and to encode and decode null values.
 * This class is useful in contexts where null values have specific significance and need to
 * be explicitly handled or validated.
 */
export class NilType extends Type {
    /**
     * Verifies that a given value is null.
     * Throws an error if the value is not null.
     * 
     * @param {*} value - The value to be verified.
     * @throws {Error} - Throws an error if the value is not null.
     * @returns {*} - The original value if it is null.
     */
    verify(value) {
        if (value !== null) {
            throw new Error(`Value of "${value}" is not nil`);
        }
        return value;
    }

    /**
     * Encodes a null value. Since the value is null, this method simply verifies the nullness
     * without writing anything to the output.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value (unused in this case).
     */
    encode(value, write) {
        this.verify(value); // Verify the value is null; no actual encoding is needed for null values
    }

    /**
     * Decodes a value and returns null, representing the concept of nullness.
     * 
     * @param {function} read - A function to read the value from the input (unused in this case).
     * @returns {null} - Returns null to represent a null value.
     */
    decode(read) {
        return null; // Always returns null as the representation of nil
    }
}

Object.freeze(NilType);