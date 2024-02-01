import { Type } from "./Type.js";

/**
 * The StructType class is designed to represent and enforce structured data types,
 * supporting properties with specified types. It ensures that instances of this
 * type are immutable and non-extensible, adhering to defined "shape" contracts.
 */
export class StructType extends Type {
    /**
     * Initializes a new instance of the StructType class with specified property types.
     * 
     * @param {Object} propertyTypes - An object mapping property names to their respective types.
     * @throws {Error} - Throws an error if no property types are provided.
     */
    constructor(propertyTypes) {
        super("object"); // Initialize the base Type class as "object".
        this.propertyTypes = {}; // Initialize an empty object to store property types.
        if (propertyTypes !== undefined) { // Ensure property types are provided.
            this.setPropertyTypes(propertyTypes);
        } else {
            throw new Error("No properties provided, a struct type must always define its shape.");
        }
    }

    /**
     * Sets and freezes the property types for the struct.
     * 
     * @param {Object} propertyTypes - An object mapping property names to their respective types.
     * @returns {StructType} - The instance itself for method chaining.
     */
    setPropertyTypes(propertyTypes) {
        const names = Object.keys(propertyTypes);
        for (let name of names) {
            this.propertyTypes[name] = this.getType(propertyTypes[name]); // Assign each property type.
        }
        Object.freeze(this.propertyTypes); // Freeze the propertyTypes to prevent further modification.
        return this;
    }

    /**
     * Verifies that an object conforms to the struct type, including property presence and types.
     * 
     * @param {Object} object - The object to verify.
     * @throws {Error} - Throws an error if the object does not conform to the struct type.
     * @returns {Object} - The verified object.
     */
    verify(object) {
        super.verify(object); // Verify that the object is of type "object".
        if (Object.getPrototypeOf(object) !== Object.prototype) {
            throw new Error("Object is not a hash map!");
        }
        for (let name in this.propertyTypes) {
            if (!object.hasOwnProperty(name)) {
                throw new Error(`Object does not have a property with the name "${name}"`);
            }
            let propertyValue = object[name];
            if (propertyValue instanceof Function) {
                throw new Error("Objects of struct type cannot have functions");
            }
            let type = this.propertyTypes[name];
            type.verify(propertyValue);
        }
        return object;
    }

    /**
     * Overrides the getType method to disallow functions in the struct.
     * 
     * @param {*} type - The type to validate.
     * @returns {Type} - The validated type.
     * @throws {Error} - Throws an error if a function type is provided.
     */
    getType(type) {
        if (type instanceof Function) {
            throw new Error("Structs cannot have functions as properties");
        }
        return super.getType(type);
    }

    /**
     * Provides a string representation of the struct type, including its property types.
     * 
     * @returns {string} - A string representation of the struct type.
     */
    toString() {
        const keys = Object.keys(this.propertyTypes);
        return `struct({${keys.map(key => `${key}: ${this.propertyTypes[key].name}`).join(", ")}})`;
    }

    /**
     * Encodes an object conforming to the struct type into a binary format.
     * 
     * @param {Object} value - The object to encode.
     * @param {function} write - A function to write the encoded object.
     */
    encode(value, write) {
        this.verify(value); // Verify the object conforms to the struct type.
        const keys = Object.keys(this.propertyTypes);
        for (let key of keys) {
            const propertyType = this.propertyTypes[key];
            propertyType.encode(value[key], write); // Encode each property value.
        }
    }

    /**
     * Decodes a binary format into an object conforming to the struct type.
     * 
     * @param {function} read - A function to read the binary data.
     * @returns {Object} - The decoded object.
     */
    decode(read) {
        const keys = Object.keys(this.propertyTypes);
        const object = {};
        for (let key of keys) {
            const propertyType = this.propertyTypes[key];
            object[key] = propertyType.decode(read); // Decode each property value.
        }
        return object;
    }

    /**
     * Calculates the total bit size needed to encode an object conforming to the struct type.
     * 
     * @param {Object} value - The object for which to calculate the bit size.
     * @returns {number} - The total bit size needed for encoding.
     */
    bitSize(value) {
        let bits = 0;
        const keys = Object.keys(this.propertyTypes);
        for (let key of keys) {
            const propertyType = this.propertyTypes[key];
            bits += propertyType.bitSize(value[key]); // Sum the bit size of each property.
        }
        return bits;
    }
}

Object.freeze(StructType);