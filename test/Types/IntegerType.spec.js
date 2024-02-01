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