/**
 * The BitStream class is designed for serializing and deserializing messages
 * following a protocol specification over a serial link in binary form.
 * It provides methods to read and write bits to and from a buffer, allowing
 * for precise control over the bit-level manipulation of data.
 */
export class BitStream {
    #buffer
    /**
     * Constructs a BitStream instance with a given buffer.
     * 
     * @param {Uint8Array} buffer - The buffer to store the bit stream.
     */
    constructor(buffer = new Uint8Array(10)) {

        // Validate input
        if(!(buffer instanceof Uint8Array)) {
            throw new Error('BitStream buffer must be a Uint8Array');
        } else if ( buffer.length === 0 ) {
            throw('BitStream buffer must not be empty');
        }



        // Store the buffer internally
        this.#buffer = buffer;

        // Initialize byte and bit indices
        let byteIndex = 0; // The index of the current byte in the buffer
        let bitIndex = 0;  // The index of the current bit within the current byte

        /**
         * Reads a specified number of bits from the buffer and returns the value.
         * 
         * @param {number} bitNumber - The number of bits to read.
         * @returns {number} - The value read from the buffer, interpreted as an unsigned integer.
         */
        this.read = (bitNumber) => {
            if (bitNumber < 0) {
                throw new Error('Number of bits must be positive');
            }
            let value = 0;
            for (let i = 0; i < bitNumber; i++) {
                value <<= 1; // Shift the value left by one bit to make room for the next bit
                // Extract the next bit from the buffer and add it to the least significant bit of value
                value |= (buffer[byteIndex] >> (7 - bitIndex)) & 1;
                bitIndex++;
                if (bitIndex === 8) {
                    bitIndex = 0;
                    byteIndex++;
                }
            }
            return value;
        };

        /**
         * Writes a value into the buffer using a specified number of bits.
         * 
         * @param {number} value - The value to write into the buffer.
         * @param {number} bitNumber - The number of bits to use for writing the value.
         */
        this.write = (value, bitNumber) => {
            var value = Number(value);
            if ( value <= 0  ) {
                throw new Error('Value must be larger than or equal to zero');  
            }
            if (bitNumber < 0 ) {
                throw new Error('Number of bits must be positive');  
            }
            for (let i = 0; i < bitNumber; i++) {
                const bitToWrite = (value >> (bitNumber - 1 - i)) & 1; // Extract the next bit from the value
                buffer[byteIndex] |= (bitToWrite << (7 - bitIndex)); // Write the extracted bit into the buffer
                bitIndex++;
                if (bitIndex === 8) {
                    bitIndex = 0;
                    byteIndex++;
                    if (byteIndex >= buffer.length) {
                        // Resize buffer if necessary
                        let newBuffer = new Uint8Array((buffer.length) * 2);
                        newBuffer.set(buffer);
                        buffer = newBuffer;
                        this.#buffer = buffer;
                    }
                }
            }
        };

        /**
         * Returns the total number of bits currently written to the buffer.
         * 
         * @returns {number} - The total number of bits in the buffer.
         */
        this.bitSize = () => {
            return byteIndex * 8 + bitIndex;
        };

        /**
         * Returns the total number of bytes currently the current buffer fits on.
         * 
         * @returns {number} - The total number of bytes in the buffer.
         */
        this.byteSize = () => {
            return byteIndex + Math.ceil(bitIndex/8);
        };

        /**
         * Moves the current position in the buffer to a specific bit index.
         * 
         * @param {number} bitPosition - The bit position to move to.
         * @throws {Error} - If the bit position is negative or larger than the current bit size.
         * @throws {Error} - If the bit position is larger than the current byte size.
         */
        this.moveTo = (bitPosition) => {
            if (bitPosition < 0) {
                throw new Error('Bit position must be positive');
            } else if (bitPosition > this.bitSize()) {
                throw new Error('Bit position must be less than or equal to the current bit size');
            }
            byteIndex = Math.floor(bitPosition / 8);
            bitIndex = bitPosition % 8;
        };
    }

    /**
     * A getter for the length of the buffer in bytes.
     * 
     * @returns {number} - The length of the buffer in bytes.
     */
    get length() {
        return this.#buffer.length;
    }

    /**
     * A getter to return a copy of the current buffer with the exact byte length required to carry all the bits written so far.
     * 
     * @returns {Uint8Array} - A copy of the current buffer with the exact byte length required to carry all the bits written so far.
     */
    get buffer() {
        return this.#buffer.slice(0, this.byteSize());
    }
}