import { Type } from "./Type.js";

/**
 * The MaybeType class encapsulates the "Maybe" type pattern, allowing values to either
 * conform to a specified type or be null/undefined. It provides methods for verification,
 * encoding, and decoding of such optional values.
 */
export class MaybeType extends Type {
    /**
     * Constructs a MaybeType instance with a specified type.
     * 
     * @param {Type} type - The Type instance representing the allowed type of values.
     */
    constructor(type) {
        super();
        this.type = this.getType(type); // Ensures the specified type is a valid Type instance.
    }

    /**
     * Verifies that a value is either of the specified type or null/undefined.
     * 
     * @param {*} value - The value to be verified.
     * @throws {Error} - Throws an error if the value does not match the type and is not null/undefined.
     */
    verify(value) {
        if (value !== undefined && value !== null) {
            this.type.verify(value);
        } else if (value === undefined || value === null) {
            return; // Value is validly null/undefined
        } else {
            throw new Error(`Value of "${value}" is neither of type ${this.type.toString()} nor null/undefined.`);
        }
    }

    /**
     * Encodes a value as either null/undefined or as the specified type. A prefix bit is used to
     * indicate the presence of the value.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value.
     */
    encode(value, write) {
        if (value === undefined || value === null) {
            write(0, 1); // Prefix bit for null/undefined
        } else {
            write(1, 1); // Prefix bit for presence of a value
            this.type.encode(value, write); // Encode the value itself
        }
    }

    /**
     * Decodes a value from its binary representation, distinguishing between null/undefined and
     * values of the specified type based on a prefix bit.
     * 
     * @param {function} read - A function to read the binary representation.
     * @returns {*} - The decoded value, either null/undefined or of the specified type.
     */
    decode(read) {
        const isNull = read(1) === 0; // Read prefix bit to check if value is null/undefined
        if (isNull) {
            return null; // Represent both null and undefined as null for simplicity
        } else {
            return this.type.decode(read); // Decode the value of the specified type
        }
    }

    /**
     * Calculates the bit size needed to encode a value, including the prefix bit.
     * 
     * @param {*} value - The value for which to calculate the bit size.
     * @returns {number} - The total bit size needed to encode the value.
     */
    bitSize(value) {
        this.verify(value); // Ensure value is valid before calculating bit size
        return 1 + (value === null || value === undefined ? 0 : this.type.bitSize(value)); // 1 bit for the prefix, plus the size of the value if present
    }
}

Object.freeze(MaybeType);