import { Type } from "./Type.js";

/**
 * The BitMapType class extends the Type class to handle a collection of bits.
 * It provides methods to verify, encode, and decode a dynamic collection of bits efficiently.
 */
export class BitMapType extends Type {
    constructor(maxBits = 1024) {
        super("object");
        this.maxBits = maxBits;
    }

    /**
     * Verifies that a value is a valid bit map, represented as an array of bits (0s and 1s).
     * 
     * @param {Array<number>} bitMap - The bit map to be verified.
     * @throws {Error} - Throws an error if the bit map is invalid.
     */
    verify(bitMap) {
        super.verify(bitMap);
        if (!Array.isArray(bitMap) || bitMap.some(bit => bit !== 0 && bit !== 1)) {
            throw new Error(`Invalid bit map type. Must be an array of 0s and 1s.`);
        }
        if (bitMap.length > this.maxBits) {
            throw new Error(`Bit map exceeds maximum length of ${this.maxBits} bits.`);
        }
    }

    /**
     * Encodes a bit map into a binary format.
     * 
     * @param {Array<number>} value - The bit map to be encoded.
     * @param {function} write - A function to write the encoded bit map.
     */
    encode(value, write) {
        this.verify(value); // Verify the bit map
        const length = value.length;
        // Encode the length of the bit map as a prefix
        const lengthBits = Math.ceil(Math.log2(this.maxBits + 1));
        write(length, lengthBits);

        // Encode the bit map
        value.forEach(bit => write(bit, 1));
    }

    /**
     * Decodes a binary format into a bit map.
     * 
     * @param {function} read - A function to read the bit map from the binary format.
     * @returns {Array<number>} - The decoded bit map.
     */
    decode(read) {
        const lengthBits = Math.ceil(Math.log2(this.maxBits + 1));
        const length = read(lengthBits); // Decode the length of the bit map
        const bitMap = [];
        for (let i = 0; i < length; i++) {
            bitMap.push(read(1)); // Decode each bit
        }
        return bitMap;
    }
}

Object.freeze(BitMapType);