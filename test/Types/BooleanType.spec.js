// import { BooleanType } from "../src/Types/BooleanType.js";
// import { BitStream } from "../src/BitStream.js";

// describe("BooleanType", () => {

//     it("should encode and decode true", () => {
//         const booleanType = new BooleanType();
//         const stream = new BitStream();

//         booleanType.encode(stream.write, true);
//         stream.moveTo(0);
//         expect(booleanType.decode(stream.read)).toBe(true);
//     });

//     it("should encode and decode false", () => {
//         const booleanType = new BooleanType();
//         const stream = new BitStream();

//         booleanType.encode(stream.write, false);
//         stream.moveTo(0);
//         expect(booleanType.decode(stream.read)).toBe(false);
//     });

//     it("should throw error when encoding non-boolean value", () => {
//         const booleanType = new BooleanType();
//         const stream = new BitStream();

//         expect(() => booleanType.encode(stream.write, 123)).toThrow();
//     });

//     it("should throw error when decoding invalid boolean encoding", () => {
//         const booleanType = new BooleanType();
//         const stream = new BitStream();
//         stream.write(2); // Invalid encoding

//         expect(() => booleanType.decode(stream.read)).toThrow();
//     });

// });

import { BooleanType } from "../src/Types/BooleanType.js";
import { BitStream } from "../src/BitStream.js";

describe('BooleanType', () => {
  let booleanType;
  let stream;

  beforeEach(() => {
    booleanType = new BooleanType();
    stream = new BitStream(new Uint8Array(10));
  });

  it('should verify true as a boolean', () => {
    expect(() => booleanType.verify(true)).not.toThrow();
  });

  it('should verify false as a boolean', () => {
    expect(() => booleanType.verify(false)).not.toThrow();
  });

  it('should throw error when verifying non-boolean value', () => {
    expect(() => booleanType.verify(123)).toThrow();
    expect(() => booleanType.verify("true")).toThrow();
    expect(() => booleanType.verify(null)).toThrow();
    expect(() => booleanType.verify(undefined)).toThrow();
  });

  it('should encode true as 1 and decode it back', () => {
    booleanType.encode(true, stream.write.bind(stream));
    stream.moveTo(0);
    expect(booleanType.decode(stream.read.bind(stream))).toBe(true);
  });

  it('should encode false as 0 and decode it back', () => {
    booleanType.encode(false, stream.write.bind(stream));
    stream.moveTo(0);
    expect(booleanType.decode(stream.read.bind(stream))).toBe(false);
  });

  it('should throw error when encoding non-boolean value', () => {
    expect(() => booleanType.encode(123, stream.write.bind(stream))).toThrow();
  });

  it('should throw error when decoding invalid boolean encoding', () => {
    // Assuming the boolean type expects only 0 or 1 for true/false, any other value should throw an error.
    stream.write(2, 1); // Attempting to write an invalid boolean value
    stream.moveTo(0);
    expect(() => booleanType.decode(stream.read.bind(stream))).toThrow();
  });

  // Optional: Test handling of edge cases, such as buffer overflow or underflow, if applicable.
});