import { ArrayType } from "../src/Types/ArrayType.js"; 
import { BooleanType } from "../src/Types/BooleanType.js";
import { IntegerType } from "../src/Types/IntegerType.js";
import { BitStream } from "../src/BitStream.js";

describe("ArrayType", () => {

    const stringType = new StringType();

    describe("verify", () => {

        it("should verify a valid array", () => {
            const arrayType = new ArrayType(stringType);
            expect(() => arrayType.verify(["a", "b", "c"])).not.toThrow();
        });

        it("should throw error for non-array input", () => {
            const arrayType = new ArrayType(stringType);
            expect(() => arrayType.verify("abc")).toThrow();
            expect(() => arrayType.verify(123)).toThrow();      
        });

        it("should throw error for array with invalid elements", () => {
            const arrayType = new ArrayType(stringType);
            expect(() => arrayType.verify([1, 2, 3])).toThrow();
        });
    });
});

describe('ArrayType', () => {
    let booleanArrayType;
    let integerArrayType;
    let stream;

    beforeEach(() => {
        // Create ArrayType instances for boolean and integer types
        const booleanType = new BooleanType();
        const integerType = new IntegerType(32, true); // Example: 32-bit signed integer
        booleanArrayType = new ArrayType(booleanType, 10); // Array of up to 10 booleans
        integerArrayType = new ArrayType(integerType, 5); // Array of up to 5 integers
        stream = new BitStream(new Uint8Array(1024)); // Large enough buffer for testing
    });

    describe('Verification', () => {
        it('should verify an array of booleans within maximum length', () => {
            const validArray = [true, false, true];
            expect(() => booleanArrayType.verify(validArray)).not.toThrow();
        });

        it('should throw an error for an array of booleans exceeding maximum length', () => {
            const longArray = new Array(11).fill(true);
            expect(() => booleanArrayType.verify(longArray)).toThrow();
        });

        it('should verify an array of integers within maximum length and type', () => {
            const validArray = [1, -2, 3];
            expect(() => integerArrayType.verify(validArray)).not.toThrow();
        });

        it('should throw an error for an array containing items not matching the item type', () => {
            const invalidArray = [true, 1, "test"]; // Mixing types
            expect(() => integerArrayType.verify(invalidArray)).toThrow();
        });
    });

    describe('Encoding and Decoding', () => {
        it('should encode and decode an array of booleans correctly', () => {
            const testArray = [true, false, true, false];
            booleanArrayType.encode(testArray, stream.write.bind(stream));
            stream.moveTo(0);
            const decodedArray = booleanArrayType.decode(stream.read.bind(stream));
            expect(decodedArray).toEqual(testArray);
        });

        it('should encode and decode an array of integers correctly', () => {
            const testArray = [123, -456, 789];
            integerArrayType.encode(testArray, stream.write.bind(stream));
            stream.moveTo(0);
            const decodedArray = integerArrayType.decode(stream.read.bind(stream));
            expect(decodedArray).toEqual(testArray);
        });

        it('should handle empty arrays correctly', () => {
          const testArray = [];
            integerArrayType.encode(testArray, stream.write.bind(stream));
            stream.moveTo(0);
            const decodedArray = integerArrayType.decode(stream.read.bind(stream));
            expect(decodedArray).toEqual(testArray);
        });
    });

    // Test edge cases
    describe('Edge Cases', () => {
          it('should throw an error when trying to encode an array with an unsupported item type', () => {
            // Assuming a hypothetical unsupported item type for demonstration
            const unsupportedItemArray = new ArrayType(new Type("unsupported"), 2);
            const testArray = ["unsupported", "data"];
            expect(() => unsupportedItemArray.encode(testArray, stream.write.bind(stream))).toThrow();
        });

        it('should encode and decode arrays up to the maximum length', () => {
            const maxArray = new Array(10).fill(true);
            booleanArrayType.encode(maxArray, stream.write.bind(stream));
            stream.moveTo(0);
            const decodedArray = booleanArrayType.decode(stream.read.bind(stream));
            expect(decodedArray).toEqual(maxArray);
        });
    });

    // More tests can be added for arrays containing complex types or nested arrays,
    // as well as testing the behavior when decoding data that doesn't conform to the expected format.
});