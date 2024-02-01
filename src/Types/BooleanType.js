import { Type } from "./Type.js";

/**
 * The BooleanType class extends the Type class to handle boolean values.
 * It provides methods to encode, decode, and determine the bit size of boolean values.
 */
export class BooleanType extends Type {
    /**
     * Constructs a BooleanType instance.
     */
    constructor() {
        super("boolean");
    }

    /**
     * Encodes a boolean value into a binary format.
     * 
     * @param {boolean} value - The boolean value to be encoded.
     * @param {function} write - A function to write the encoded boolean value.
     */
    encode(value, write) {
        this.verify(value);
        write(value ? 1 : 0); // Encode true as 1 and false as 0
    }

    /**
     * Decodes a binary format into a boolean value.
     * 
     * @param {function} read - A function to read the boolean value from the binary format.
     * @returns {boolean} - The decoded boolean value.
     */
    decode(read) {
        return read(1) === 1; // Decode 1 as true and 0 as false
    }

    /**
     * Determines the bit size of the boolean value.
     * 
     * @param {boolean} value - The boolean value to determine the bit size for.
     * @returns {number} - The bit size of the boolean value, which is always 1.
     */
    bitSize(value) {
        this.verify(value);
        return 1; // Boolean values always use 1 bit
    }
}

// Freezes the BooleanType class to prevent modification
Object.freeze(BooleanType);