import { Type } from "./Type.js";

/**
 * The UnionType class extends the Type class to handle values that can be one of several types.
 * It provides methods to verify, encode, and decode values based on a set of possible types.
 */
export class UnionType extends Type {
    /**
     * Constructs an UnionType instance with a given set of types.
     * 
     * @param {...Type} types - A list of Type instances representing the possible types of values.
     */
    constructor(...types) {
        super();
        this.types = types;
    }

    /**
     * Verifies that an option is one of the specified types.
     * Throws an error if the option does not match any of the types.
     * 
     * @param {*} option - The value to be verified.
     * @throws {Error} - Throws an error if the option does not match any of the types.
     */
    verify(option) {
        const isValid = this.types.some(type => {
                return type.validate(value);
        });
        if (!isValid) throw new Error(`"${option}" must be one of [${this.types.map(t => t.name)}]`);
    }

    /**
     * Converts the UnionType instance to a string representation.
     * 
     * @returns {string} - A string representation of the UnionType instance.
     */
    toString() {
        return `union(${this.types.map(t => t.name)})`;
    }

    /**
     * Encodes a value based on its type within the set of possible types.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value.
     */
    encode(value, write) {
        this.verify(value);
        const typeIndex = this.types.findIndex(t => t.validate(value));
        const typeBits = Math.ceil(Math.log2(this.types.length));
        write(typeIndex, typeBits);
        this.types[typeIndex].encode(value, write);
    }

    /**
     * Decodes a binary format into a value based on its type within the set of possible types.
     * 
     * @param {function} read - A function to read the value from the binary format.
     * @returns {*} - The decoded value.
     */
    decode(read) {
        const typeBits = Math.ceil(Math.log2(this.types.length));
        const typeIndex = read(typeBits);
        return this.types[typeIndex].decode(read);
    }
}
export class OneOfType extends UnionType {}
Object.freeze(UnionType);
Object.freeze(OneOfType);