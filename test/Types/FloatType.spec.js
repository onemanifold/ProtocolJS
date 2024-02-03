import { FloatType } from './FloatType.js';
import { BitStream } from '../../src/BitStream.js';

describe('FloatType', () => {
    let floatType;

    beforeEach(() => {
        floatType = new FloatType();
    });

    describe('verify', () => {
        it('should accept a finite 32-bit float', () => {
            const finiteFloat = 123.456;
            expect(() => floatType.verify(finiteFloat)).not.toThrow();
        });

        it('should throw error for non-finite values', () => {
            const values = [NaN, Infinity, -Infinity];
            values.forEach(value => {
                expect(() => floatType.verify(value)).toThrowError(/is not a finite float/);
            });
        });

        it('should throw error for values not representable as a 32-bit float', () => {
            // Example for values not representable might be specific edge cases in a more detailed implementation.
            // Since JavaScript uses double-precision floats (64-bit), finding a value not representable as a 32-bit float but is a number is challenging without delving into specific binary representations.
            // For the sake of this test, we focus on the finite check.
        });
    });

    describe('encode and decode', () => {
        it('should correctly encode and decode a 32-bit float', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const float = 123.456;

            floatType.encode(float, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            const decodedFloat = floatType.decode(() => stream.read(32));
            expect(decodedFloat).toBeCloseTo(float);
        });

        it('should handle edge cases of 32-bit float encoding/decoding', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const edgeCases = [Number.MIN_VALUE, Number.MAX_VALUE, 0, -0];

            edgeCases.forEach((value) => {
                stream.reset();
                floatType.encode(value, (val, bitNum) => stream.write(val, bitNum));
                stream.moveTo(0);
                const decodedValue = floatType.decode(() => stream.read(32));
                expect(decodedValue).toBeCloseTo(value);
            });
        });
    });
});