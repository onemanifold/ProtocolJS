import { StringType } from "../src/StringType.js";
import { BitStream } from "../../src/BitStream.js"

it("should verify a string", () => {
    var string = new StringType()
    string.verify("This is a string")
    expect(() => string.verify({})).toThrow();
})

describe("StringType", () => {

    // ...other tests
  
    it("should encode and decode a string", () => {
      const stringType = new StringType();
      const stream = new BitStream();
      
      const testString = "Hello World";
      
      stringType.encode(testString, stream.write);
      stream.moveTo(0);
      expect(stringType.decode(stream.read)).toBe(testString);
    });
  
    it("should throw error when decoding invalid string", () => {
      const stringType = new StringType();
      const stream = new BitStream();
      
      // Write invalid data
      stream.writeUInt8(0x01);
      
      expect(() => stringType.decode(stream.read)).toThrow();
    });
  
  });

  import { StringType } from "../src/Types/StringType.js";
import { BitStream } from "../src/BitStream.js";

describe('StringType', () => {
  let stringType;
  let stream;

  beforeEach(() => {
    stringType = new StringType();
    stream = new BitStream(new Uint8Array(1024)); // Assume a buffer large enough for testing
  });

  describe('Verification', () => {
    it('should verify strings within maximum length', () => {
      const testString = 'a'.repeat(65536); // Maximum allowed length
      expect(() => stringType.verify(testString)).not.toThrow();
    });

    it('should throw error for strings exceeding maximum length', () => {
      const testString = 'a'.repeat(65537); // Exceeds maximum allowed length
      expect(() => stringType.verify(testString)).toThrow();
    });
  });

  describe('Custom Length', () => {
    it('should create a new instance with a specified maximum length and verify accordingly', () => {
      const customMaxLength = 10;
      const customStringType = stringType.length(customMaxLength);
      const validString = 'a'.repeat(customMaxLength);
      const invalidString = 'a'.repeat(customMaxLength + 1);

      expect(() => customStringType.verify(validString)).not.toThrow();
      expect(() => customStringType.verify(invalidString)).toThrow();
    });
  });

  describe('Encoding and Decoding', () => {
    it('should encode and decode a string correctly', () => {
      const testString = 'Hello, World!';
      stringType.encode(testString, stream.write.bind(stream));
      stream.moveTo(0);
      const decodedString = stringType.decode(stream.read.bind(stream));
      expect(decodedString).toBe(testString);
    });

    it('should handle empty strings correctly', () => {
      const testString = '';
      stringType.encode(testString, stream.write.bind(stream));
      stream.moveTo(0);
      const decodedString = stringType.decode(stream.read.bind(stream));
      expect(decodedString).toBe(testString);
    });

    it('should encode and decode strings up to the maximum length', () => {
      const testString = 'a'.repeat(65536); // Maximum allowed length
      stringType.encode(testString, stream.write.bind(stream));
      stream.moveTo(0);
      const decodedString = stringType.decode(stream.read.bind(stream));
      expect(decodedString).toBe(testString);
    });
  });

  // Add more tests here for edge cases, such as strings with special characters, very long strings, etc.
});