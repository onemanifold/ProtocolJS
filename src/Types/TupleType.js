import { Type } from "./Type.js";

/**
 * The TupleType class extends the Type class to manage tuples, which are immutable,
 * ordered lists of elements where each element can have a different type.
 * This class provides methods to verify, encode, and decode tuples based on their defined types.
 */
export class TupleType extends Type {
    /**
     * Constructs a TupleType instance with specified types for the tuple elements.
     * 
     * @param {Object} types - An object mapping labels to Type instances for each tuple element.
     * @throws {Error} - Throws an error if less than two types are defined.
     */
    constructor(types) {
        super("object"); // Initialize the base Type class as "object".
        const typeKeys = Object.keys(types); // Get the type labels.
        if (typeKeys.length < 2) { // Ensure there are at least two types.
            throw new Error("Tuple type must define at least two values");
        }
        this.types = {}; // Initialize an empty object to store types.
        for (let key in types) { // For every type key,
            this.types[key] = this.getType(types[key]); // Retrieve and store the type.
        }
        this.length = Object.values(this.types).length; // Store the length of the tuple.
        Object.freeze(this); // Freeze the TupleType instance to ensure immutability.
        Object.freeze(this.types); // Freeze the types to prevent modification.
    }

    /**
     * Verifies that a value conforms to the tuple structure, including each element's type.
     * 
     * @param {Array} value - The tuple value to be verified.
     * @throws {Error} - Throws an error if the value does not conform to the tuple structure.
     */
    verify(value) {
        super.verify(value); // Verify that the value is an object.
        if (!(value instanceof Array)) {
            throw new Error(`${value} must be an array`);
        }
        const typesArray = Object.values(this.types); // Get the types array.
        if (value.length !== typesArray.length) { // Ensure value length matches types array length.
            throw new Error(`${value} has the wrong size`);
        }
        typesArray.forEach((type, index) => {
            type.verify(value[index]); // Verify each value element against its corresponding type.
        });
    }

    /**
     * Provides a string representation of the tuple type, including its element types.
     * 
     * @returns {string} - A string representation of the tuple type.
     */
    toString() {
        return `tuple(${Object.values(this.types).map(t => t.name).join(", ")})`;
    }

    /**
     * Encodes a tuple value into a binary format based on its element types.
     * 
     * @param {Array} value - The tuple value to be encoded.
     * @param {function} write - A function to write the encoded value.
     */
    encode(value, write) {
        this.verify(value); // Verify the tuple value.
        Object.values(this.types).forEach((type, index) => {
            type.encode(value[index], write); // Encode each tuple element.
        });
    }

    /**
     * Decodes a binary format into a tuple value based on its element types.
     * 
     * @param {function} read - A function to read the binary data.
     * @returns {Array} - The decoded tuple value.
     */
    decode(read) {
        const typesArray = Object.values(this.types); // Get the types array.
        return typesArray.map(type => type.decode(read)); // Decode each tuple element and return the tuple array.
    }
}

Object.freeze(TupleType);