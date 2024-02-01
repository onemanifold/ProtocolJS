import { Type } from "./Type.js";

export class BinaryType extends Type {
    /**
     * Constructs a BinaryType instance with a specified maximum number of bytes.
     * This type is used for binary data handling, enforcing size constraints.
     * 
     * @param {number} maxBytes - The maximum number of bytes allowed.
     * @throws {Error} - Throws an error if maxBytes is not defined.
     */
    constructor(maxBytes = 1024) {
        super("object");
        if (!maxBytes) {
            throw new Error("Binary Type must define a maximum number of bytes");
        }
        this.maxBytes = maxBytes;
    }

    /**
     * Creates a new BinaryType instance with a specified maximum number of bytes.
     * 
     * @param {number} maxBytes - The new maximum number of bytes for the binary type.
     * @returns {BinaryType} - A new BinaryType instance with the specified maximum number of bytes.
     */
    bytes(maxBytes) {
        return Object.create(this, { maxBytes: { value: maxBytes } });
    }

    /**
     * Verifies that a buffer conforms to the binary type's constraints.
     * Throws an error if the buffer does not conform.
     * 
     * @param {Array|Uint8Array|ArrayBuffer|BitStream} buffer - The buffer to be verified.
     * @throws {Error} - Throws an error if the buffer is not a valid binary type or exceeds the maximum size.
     */
    verify(buffer) {
        super.verify(buffer);
        if (buffer instanceof Array || buffer instanceof Uint8Array || buffer instanceof ArrayBuffer || buffer instanceof BitStream) {
            if (buffer.length > this.maxBytes) {
                throw new Error(`Binary value is larger than ${this.maxBytes}`);
            }
        } else {
            throw new Error(`Invalid binary type "${buffer}"`);
        }
    }

    /**
     * Encodes a binary value into a binary format.
     * 
     * @param {Array|Uint8Array|ArrayBuffer|BitStream} value - The binary value to be encoded.
     * @param {function} write - A function to write each encoded item.
     */
    encode(value, write) {
        this.verify(value);
        if (this.maxBytes > 1) {
            const maxLengthBits = Math.ceil(Math.log2(this.maxBytes));
            write(value.length, maxLengthBits);
        }
        for (let byte of value) {
            write(byte, 8);
        }
    }

    /**
     * Decodes a binary format into a binary value.
     * 
     * @param {function} read - A function to read each item from the binary format.
     * @returns {Uint8Array} - The decoded binary value.
     */
    decode(read) {
        let length = 1;
        if (this.maxBytes > 1) {
            const maxLengthBits = Math.ceil(Math.log2(this.maxBytes));
            length = read(maxLengthBits);
        }
        const buffer = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            buffer[i] = read(8);
        }
        return buffer;
    }
}

// Freezes the BinaryType class to prevent modification
Object.freeze(BinaryType);