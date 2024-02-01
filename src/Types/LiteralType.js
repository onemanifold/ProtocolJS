import { Type } from "./Type.js";

/**
 * The LiteralType class extends the Type class to enforce a specific literal value.
 * It provides methods to verify, encode, and decode a value, ensuring it matches the specified literal.
 */
export class LiteralType extends Type {
    /**
     * Constructs a LiteralType instance with a given literal value.
     * 
     * @param {*} value - The literal value to be enforced by this type.
     */
    constructor(value) {
        super(typeof value); // Call the parent constructor with the type of the value
        this.value = value; // Store the literal value
    }

    /**
     * Verifies that a given value matches the specified literal value.
     * Throws an error if the value does not match.
     * 
     * @param {*} value - The value to be verified.
     * @throws {Error} - Throws an error if the value does not match the specified literal.
     */
    verify(value) {
        super.verify(value); // Verify the type of the value
        if (value !== this.value) {
            throw new Error(`${JSON.stringify(value)} is not ${JSON.stringify(this.value)}`);
        }
    }

    /**
     * Returns a string representation of the LiteralType instance, including the literal value.
     * 
     * @returns {string} - A string representation of the LiteralType instance.
     */
    toString() {
        return `literal(${JSON.stringify(this.value)})`;
    }

    /**
     * Encodes the specified value. Since LiteralType enforces a specific value, encoding is not needed.
     * This method simply verifies the value.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value (unused in this case).
     */
    encode(value, write) {
        this.verify(value); // Verify the value matches the literal; no encoding is performed
    }

    /**
     * Decodes a value, always returning the specified literal value.
     * Since LiteralType enforces a specific value, decoding simply returns this value.
     * 
     * @param {function} read - A function to read the value from the input (unused in this case).
     * @returns {*} - The literal value enforced by this type.
     */
    decode(read) {
        return this.value; // Always returns the specified literal value
    }
}

Object.freeze(LiteralType);