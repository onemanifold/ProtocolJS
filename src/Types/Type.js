/**
 * The Type class is designed to enforce type constraints on values.
 * It provides methods to verify and validate that values conform to a specified type.
 * This class can be used to ensure data integrity and consistent type usage.
 */
export class Type {
    // Private field to store the type
    #type;

    /**
     * Constructs a Type instance with a given type.
     * 
     * @param {string} type - A string representing the type to be enforced (e.g., 'number', 'string').
     */
    constructor(type) {
        // Set the type if it's provided
        if (type !== undefined) {
            this.#type = type;
        }
    }

    /**
     * Verifies that a given value matches the specified type.
     * Throws an error if the value does not match the type.
     * 
     * @param {*} value - The value to be verified.
     * @throws {Error} - Throws an error if the value does not match the type.
     */
    verify(value) {
        if (this.#type && value !== undefined && value !== null && typeof value !== this.#type) {
            throw new Error(`${value} is not of ${this.#type} type`);
        }
    }

    /**
     * Validates that a given value matches the specified type.
     * Returns true if the value matches, false otherwise.
     * 
     * @param {*} value - The value to be validated.
     * @returns {boolean} - True if the value matches the type, false otherwise.
     */
    validate(value) {
        try {
            this.verify(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * A getter for the name of the type.
     * 
     * @returns {string} - The name of the type.
     */
    get name() {
        return this.toString();
    }

    /**
     * Converts the Type instance to a string representation.
     * 
     * @returns {string} - A string representation of the Type instance.
     */
    toString() {
        return this.constructor.name.toLowerCase().replace("type", "");
    }

    /**
     * Serializes the instance's properties into an array.
     * 
     * @returns {Array} - An array of the instance's properties.
     */
    serialize() {
        return Object.values(this);
    }

    /**
     * Deserializes an array of values into the instance's properties.
     * 
     * @param {Array} values - An array of values to deserialize into the instance.
     */
    deserialize(values) {
        const keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this[key] = values[i];
        }
    }
    
    /**
    * Validates and returns a Type instance.
    * Throws an error if the provided argument is not a Type instance.
    * 
    * @param {Type} type - The Type instance to be validated.
    * @returns {Type} - The validated Type instance.
    * @throws {Error} - Throws an error if the argument is not a Type instance.
    */
   static getType(type) {
       if (!(type instanceof Type)) {
           throw new Error(`"${type.toString()}" is not a type`);
       } else {
           return type;
       }
   }
}

// Freezes the Type class to prevent modification
Object.freeze(Type);