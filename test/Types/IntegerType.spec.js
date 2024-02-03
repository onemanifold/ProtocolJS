import { IntegerType } from "../src/IntegerType.js";
import { BitStream } from "../../src/BitStream.js";

describe("IntegerType with BitStream", () => {
    // Helper function to encode and decode a value using IntegerType and BitStream
    function encodeAndDecode(value, bitsNum, signed) {
      const intType = new IntegerType(bitsNum, signed);
      const buffer = new Uint8Array(Math.ceil(bitsNum / 8));
      const bitStream = new BitStream(buffer);
      
      // Encode the value
      intType.encode(value, bitStream.write);
      
      // Reset the bitStream position and decode
      bitStream.moveTo(0);
      const decodedValue = intType.decode(bitStream.read);
      
      return decodedValue;
    }
  
    it("should encode and decode 8-bit signed integers", () => {
      expect(encodeAndDecode(0, 8, true)).toBe(0);
      expect(encodeAndDecode(-128, 8, true)).toBe(-128);
      expect(encodeAndDecode(127, 8, true)).toBe(127);
    });
  
    it("should encode and decode 8-bit unsigned integers", () => {
      expect(encodeAndDecode(0, 8, false)).toBe(0);
      expect(encodeAndDecode(255, 8, false)).toBe(255);
    });
  
    it("should encode and decode integers with arbitrary bit lengths", () => {
      // Test with various bit lengths and values
      expect(encodeAndDecode(7, 3, true)).toBe(7);
      expect(encodeAndDecode(45, 7, false)).toBe(45);
      expect(encodeAndDecode(1023, 10, true)).toBe(1023);
      expect(encodeAndDecode(2097151, 21, false)).toBe(2097151);
      expect(encodeAndDecode(123456789, 28, true)).toBe(123456789);
    });
  
    it("should handle edge cases and throw errors for invalid values", () => {
      // Test with values close to maximum limits
      expect(() => encodeAndDecode(127, 7, true)).toThrow(); // Should throw for signed 7-bit value
  
      // Test values that exceed the maximum range
      expect(() => encodeAndDecode(256, 8, false)).toThrow(); // Should throw for unsigned 8-bit value
      expect(() => encodeAndDecode(128, 8, true)).toThrow(); // Should throw for signed 8-bit value
    });
});

describe('IntegerType', () => {
  let intTypeUnsigned;
  let intTypeSigned;
  let stream;

  beforeEach(() => {
    // Create instances for testing both signed and unsigned integers with a specific number of bits
    intTypeUnsigned = new IntegerType(8, false); // Example: 8-bit unsigned integer
    intTypeSigned = new IntegerType(8, true); // Example: 8-bit signed integer
    stream = new BitStream(new Uint8Array(10));
  });

  describe('Verification', () => {
    it('should verify valid unsigned integer', () => {
      expect(() => intTypeUnsigned.verify(255)).not.toThrow();
    });

    it('should throw error for unsigned integer out of range', () => {
      expect(() => intTypeUnsigned.verify(256)).toThrow();
      expect(() => intTypeUnsigned.verify(-1)).toThrow();
    });

    it('should verify valid signed integer', () => {
      expect(() => intTypeSigned.verify(127)).not.toThrow();
      expect(() => intTypeSigned.verify(-128)).not.toThrow();
    });

    it('should throw error for signed integer out of range', () => {
      expect(() => intTypeSigned.verify(128)).toThrow();
      expect(() => intTypeSigned.verify(-129)).toThrow();
    });

    it('should throw error for non-integer values', () => {
      expect(() => intTypeUnsigned.verify(3.14)).toThrow();
      expect(() => intTypeSigned.verify("100")).toThrow();
    });
  });

  describe('Encoding and Decoding', () => {
    it('should encode and decode unsigned integer correctly', () => {
      const value = 255; // Max value for 8-bit unsigned
      intTypeUnsigned.encode(value, stream.write.bind(stream));
      stream.moveTo(0);
      const decoded = intTypeUnsigned.decode(stream.read.bind(stream));
      expect(decoded).toBe(value);
    });

    it('should encode and decode signed integer correctly', () => {
      const positiveValue = 127; // Max positive value for 8-bit signed
      const negativeValue = -128; // Min value for 8-bit signed
      intTypeSigned.encode(positiveValue, stream.write.bind(stream));
      stream.moveTo(0);
      let decoded = intTypeSigned.decode(stream.read.bind(stream));
      expect(decoded).toBe(positiveValue);

      stream = new BitStream(new Uint8Array(10)); // Reset stream for next test
      intTypeSigned.encode(negativeValue, stream.write.bind(stream));
      stream.moveTo(0);
      decoded = intTypeSigned.decode(stream.read.bind(stream));
      expect(decoded).toBe(negativeValue);
    });

    it('should handle sign bit correctly for signed integers', () => {
      intTypeSigned.encode(-1, stream.write.bind(stream));
      stream.moveTo(0);
      const decoded = intTypeSigned.decode(stream.read.bind(stream));
      expect(decoded).toBe(-1);
    });
  });

  // Add more tests here for edge cases, such as very small or very large numbers,
  // and special cases like encoding/decoding the maximum and minimum possible values.
});

