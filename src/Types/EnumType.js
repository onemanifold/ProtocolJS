import { Type } from "./Type.js";

/**
 * The EnumType class extends the Type class to handle enumeration of values.
 * It allows for the specification of a set of valid options for a value, ensuring that
 * any value assigned matches one of these predefined options.
 */
export class EnumType extends Type {
    /**
     * Constructs an EnumType instance with a specified base type and a set of options.
     * 
     * @param {Type} type - The base type of the enumeration (e.g., Type instance for 'StringType' or 'NumberType').
     * @param {Array<*>} options - An array of options that are valid for this enumeration.
     */
    constructor(type, options) {
        super(); // Initialize the base Type with the name of the type
        this.type = Type.getType(type);
        this.options = [];
        options.forEach(option => {
            this.type.verify(option); // Verify each option against the base type
            this.options.push(option); // push option into options array
        });
    }

    /**
     * Verifies that an option is one of the specified options for the enumeration.
     * 
     * @param {*} option - The value to be verified.
     * @throws {Error} - Throws an error if the option is not one of the specified options.
     */
    verify(option) {
        this.type.verify(option); // First verify the option against the base type
        if (!this.options.includes(option)) {
            throw new Error(`"${option}" must be one of [${this.options.join(', ')}]`);
        }
    }

    /**
     * Converts the EnumType instance to a string representation.
     * 
     * @returns {string} - A string representation of the EnumType instance.
     */
    toString() {
        return `enum(${this.type.name}, [${this.options.join(', ')}])`;
    }

    /**
     * Encodes a value based on its index within the set of options.
     * 
     * @param {*} value - The value to be encoded.
     * @param {function} write - A function to write the encoded value.
     */
    encode(value, write) {
        this.verify(value); // Verify the value
        const optionIndex = this.options.indexOf(value); // Get the option index
        const optionBits = Math.ceil(Math.log2(this.options.length)); // Get the minimum number of bits required
        write(optionIndex, optionBits); // Encode the option index
    }

    /**
     * Decodes a value based on its index within the set of options.
     * 
     * @param {function} read - A function to read the encoded value.
     * @returns {*} - The decoded option value.
     */
    decode(read) {
        const optionBits = Math.ceil(Math.log2(this.options.length)); // Get the minimum number of bits required
        const optionIndex = read(optionBits); // Decode the option index
        return this.options[optionIndex]; // Return the option
    }
}

Object.freeze(EnumType);