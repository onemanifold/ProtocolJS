import { UnionType, StringType, NumberType, BooleanType } from './types';
import { BitStream } from '../../src/BitStream.js';


describe('UnionType', () => {

  let union;

  beforeEach(() => {
    const stringType = new StringType();
    const numberType = new NumberType(); 
    union = new UnionType(stringType, numberType);
  });

  describe('verify', () => {

    it('should pass for string value', () => {
      expect(() => {
        union.verify('hello');
      }).not.toThrow();
    });

    it('should pass for number value', () => {
       expect(() => {
         union.verify(25);
       }).not.toThrow();
    });

    it('should throw error for incorrect value type', () => {
      expect(() => {
        union.verify(true);
      }).toThrowError(/must be one of/);
    });

  });

  describe('encode', () => {

    it('should encode string value properly', () => {
      const writeSpy = jest.fn();
      union.encode('test', writeSpy);

      expect(writeSpy.mock.calls[0][0]).toBe(1); // type index
      expect(writeSpy.mock.calls[1][0]).toBe('test'); // value
    });

    it('should encode number value properly', () => {
      const writeSpy = jest.fn();
      union.encode(10, writeSpy);

      expect(writeSpy.mock.calls[0][0]).toBe(0); // type index
      expect(writeSpy.mock.calls[1][0]).toBe(10); // value
    });

  });

});


describe('UnionType', () => {
    let union;

    beforeEach(() => {
        const stringType = new StringType();
        const numberType = new NumberType();
        const booleanType = new BooleanType(); // Adding BooleanType for more comprehensive testing
        union = new UnionType(stringType, numberType, booleanType);
    });

    describe('encode and decode', () => {
        it('should correctly encode and decode a string value', () => {
            const stream = new BitStream(new Uint8Array(1024)); // Assuming a buffer large enough for testing
            const value = 'test';

            union.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0); // Reset to the start of the stream for reading
            const decodedValue = union.decode(() => stream.read(1)); // Reading 1 bit for demonstration, adjust as needed
            expect(decodedValue).toEqual(value);
        });

        it('should correctly encode and decode a number value', () => {
            const stream = new BitStream(new Uint8Array(1024)); // Adjust the buffer size as necessary
            const value = 123;

            union.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0); // Reset to start for reading
            const decodedValue = union.decode(() => stream.read(1)); // Adjust bit read count based on actual type encoding
            expect(decodedValue).toEqual(value);
        });

        it('should correctly encode and decode a boolean value', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const value = true;

            union.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            const decodedValue = union.decode(() => stream.read(1)); // Adjust reading bits as per the boolean encoding
            expect(decodedValue).toEqual(value);
        });

        it('should throw error when encoding an unsupported value', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const value = {};

            expect(() => union.encode(value, (val, bitNum) => stream.write(val, bitNum))).toThrowError(/must be one of/);
        });
    });
});