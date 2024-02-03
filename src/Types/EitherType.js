import { Type } from "./Type.js";

/**
 * The EitherType class extends the Type class to handle values that can be one of two types,
 * typically used to represent a value with a success type or an error type.
 */
export class EitherType extends Type {
    /**
     * Constructs an EitherType instance with two possible types.
     * 
     * @param {Type} leftType - The Type instance representing the left or error type.
     * @param {Type} rightType - The Type instance representing the right or success type.
     */
    constructor(leftType, rightType) {
        super();
        this.leftType = Type.getType(leftType);
        this.rightType = Type.getType(rightType);
    }

    /**
     * Verifies that an option is one of the specified types (left or right).
     * Throws an error if the option does not match any of the types.
     * 
     * @param {*} option - The value to be verified.
     * @throws {Error} - Throws an error if the option does not match either type.
     */
    verify(option) {
        // If neither left or right are valid
        if (this.leftType.validate(option) && this.rightType.validate(option)) {
            throw new Error(`Value "${option}" does not match either the left or right type.`);
        }
    }

    /**
     * Encodes a value based on its matching type (left or right) within the EitherType.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value.
     */
    encode(value, write) {
        this.verify(value); // Ensure the value conforms to one of the possible types.
        let typeIndex = this.leftType.validate(value) ? 0 : 1;
        write(typeIndex, 1); // Write the type index (0 for left, 1 for right)
        if (typeIndex === 0) {
            this.leftType.encode(value, write);
        } else {
            this.rightType.encode(value, write);
        }
    }

    /**
     * Decodes a binary format into a value based on the EitherType's types (left or right).
     * 
     * @param {function} read - A function to read the binary representation.
     * @returns {*} - The decoded value.
     */
    decode(read) {
        const typeIndex = read(1); // Read the type index (0 for left, 1 for right)
        if (typeIndex === 0) {
            return this.leftType.decode(read); // Decode using the left type
        } else {
            return this.rightType.decode(read); // Decode using the right type
        }
    }

    /**
     * Provides a string representation of the EitherType, including its left and right types.
     * 
     * @returns {string} - A string representation of the EitherType.
     */
    toString() {
        return `either(${this.leftType.name}, ${this.rightType.name})`;
    }
}

Object.freeze(EitherType);