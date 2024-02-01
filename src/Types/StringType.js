/**
 * The StringType class extends the Type class to handle string values,
 * providing methods to verify, encode, and decode strings while enforcing a maximum length constraint.
 */
export class StringType extends Type {
    /**
     * Constructs a StringType instance with a default maximum length for strings.
     */
    constructor() { 
        super("string");
        this.maxLength = 65536; // Set the default maximum length of a string
    }

    /**
     * Creates a new StringType instance with a specified maximum length.
     * 
     * @param {number} maxLength - The maximum length of strings for the new StringType instance.
     * @returns {StringType} - A new StringType instance with the specified maximum length.
     */
    length(maxLength) {
        return Object.create(this, {maxLength: {value: maxLength}});
    }

    /**
     * Verifies that a string value conforms to the type and does not exceed the maximum length.
     * Throws an error if the string is too long.
     * 
     * @param {string} value - The string value to be verified.
     * @throws {Error} - Throws an error if the string exceeds the maximum length.
     */
    verify(value) {
        super.verify(value); // Verify that the value is a string
        if (value.length > this.maxLength) {
            throw new Error(`String is too long, maximum length is ${this.maxLength}`);
        }
    }

    /**
     * Encodes a string value into a binary format.
     * 
     * @param {string} value - The string value to be encoded.
     * @param {function} write - A function to write the encoded string value.
     */
    encode(value, write) {
        this.verify(value); // Verify the string value
        const maxLengthBits = Math.ceil(Math.log2(this.maxLength)); // Calculate the number of bits required to represent the maximum length
        write(value.length, maxLengthBits); // Write the length of the string
        const byteArray = new TextEncoder().encode(value); // Encode the string as a byte array
        byteArray.forEach(byte => write(byte, 8)); // Write each byte
    }

    /**
     * Decodes a binary format into a string value.
     * 
     * @param {function} read - A function to read the binary representation.
     * @returns {string} - The decoded string value.
     */
    decode(read) { 
        const maxLengthBits = Math.ceil(Math.log2(this.maxLength)); // Calculate the number of bits required to represent the maximum length
        const length = read(maxLengthBits); // Read the length of the string
        if (length > 0) {
            const byteArray = new Uint8Array(length); // Create a byte array of the specified length
            for (let i = 0; i < length; i++) {
                byteArray[i] = read(8); // Read each byte
            }
            return new TextDecoder().decode(byteArray); // Decode the byte array as a string
        } else {
            return ""; // Return an empty string if the length is zero
        }
    }
}

Object.freeze(StringType);