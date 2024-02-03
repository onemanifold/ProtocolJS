import { Type } from "./Type.js";

/**
 * The ArrayType class extends the Type class to handle arrays, providing
 * methods to verify, encode, and decode arrays of a specified item type and maximum length.
 */
export class ArrayType extends Type {
    /**
     * Constructs an ArrayType instance with a specified item type and maximum length.
     * 
     * @param {Type} itemType - The type of items in the array.
     * @param {number} [maxLength=65536] - The maximum length of the array.
     */
    constructor(itemType, maxLength = 65536) {
        super("object");
        this.maxLength = maxLength;
        if (itemType) this.itemType = Type.getType(itemType);
    }

    /**
     * Verifies that an array conforms to the specified item type and maximum length.
     * Throws an error if the array does not conform.
     * 
     * @param {Array} array - The array to be verified.
     * @throws {Error} - Throws an error if the array is too long or items do not match the type.
     */
    verify(array) {
        super.verify(array);
        if (array.length > this.maxLength) {
            throw new Error(`Array is too long, maximum length is ${this.maxLength}`);
        }
        for (let value of array) {
            this.itemType.verify(value);
        }
    }

    /**
     * Converts the ArrayType instance to a string representation.
     * 
     * @returns {string} - A string representation of the ArrayType instance.
     */
    toString() {
        return `array(${this.itemType.name})`;
    }

    /**
     * Creates a new ArrayType instance with a specified item type.
     * 
     * @param {Type} itemType - The new item type for the array.
     * @returns {ArrayType} - A new ArrayType instance with the specified item type.
     */
    type(itemType) {
        return Object.create(this, { itemType: { value: itemType } });
    }

    /**
     * Creates a new ArrayType instance with a specified maximum length.
     * 
     * @param {number} maxLength - The new maximum length for the array.
     * @returns {ArrayType} - A new ArrayType instance with the specified maximum length.
     */
    length(maxLength) {
        return Object.create(this, { maxLength: { value: maxLength } });
    }

    /**
     * Encodes an array into a binary format.
     * 
     * @param {Array} value - The array to be encoded.
     * @param {function} write - A function to write each encoded item.
     */
    encode(value, write) {
        this.verify(value);
        const maxLengthBits = Math.ceil(Math.log2(this.maxLength));
        write(value.length, maxLengthBits);
        for (let item of value) {
            this.itemType.encode(item, write);
        }
    }

    /**
     * Decodes a binary format into an array.
     * 
     * @param {function} read - A function to read each item from the binary format.
     * @returns {Array} - The decoded array.
     */
    decode(read) {
        const maxLengthBits = Math.ceil(Math.log2(this.maxLength));
        const length = read(maxLengthBits);
        const array = new Array(length);
        for (let i = 0; i < length; i++) {
            array[i] = this.itemType.decode(read);
        }
        return array;
    }
}

// Freezes the ArrayType class to prevent modification
Object.freeze(ArrayType);