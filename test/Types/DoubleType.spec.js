import { DoubleType } from './DoubleType.js';
import { BitStream } from '../../src/BitStream.js';

describe('DoubleType', () => {
    let doubleType;
    let stream;

    beforeEach(() => {
        doubleType = new DoubleType();
        stream = new BitStream(new Uint8Array(8)); // 8 bytes for a 64-bit double
    });

    describe('verify', () => {
        it('should verify finite double values', () => {
            expect(() => doubleType.verify(42.42)).not.toThrow();
            expect(() => doubleType.verify(-123.456)).not.toThrow();
        });

        it('should throw for non-finite values', () => {
            expect(() => doubleType.verify(NaN)).toThrowError(/not a finite double/);
            expect(() => doubleType.verify(Infinity)).toThrowError(/not a finite double/);
            expect(() => doubleType.verify(-Infinity)).toThrowError(/not a finite double/);
        });
    });

    describe('encode and decode', () => {
        it('should correctly encode and decode finite double values', () => {
            const originalValue = 123.456;
            doubleType.encode(originalValue, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0); // Reset stream to start for reading
            const decodedValue = doubleType.decode(() => stream.read(64));
            expect(decodedValue).toBeCloseTo(originalValue);
        });

        it('should maintain precision for complex numbers', () => {
            const complexValue = Math.PI;
            doubleType.encode(complexValue, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0); // Reset to start for decoding
            const decodedValue = doubleType.decode(() => stream.read(64));
            expect(decodedValue).toBeCloseTo(complexValue);
        });
    });

    // Testing special edge cases
    describe('Edge Cases', () => {
        it('should handle the smallest and largest finite double values', () => {
            const smallestValue = Number.MIN_VALUE;
            const largestValue = Number.MAX_VALUE;
            
            stream = new BitStream(new Uint8Array(8)); // Reset stream for new test
            doubleType.encode(smallestValue, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            expect(doubleType.decode(() => stream.read(64))).toBeCloseTo(smallestValue);

            stream = new BitStream(new Uint8Array(8)); // Reset stream for another test
            doubleType.encode(largestValue, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            expect(doubleType.decode(() => stream.read(64))).toBeCloseTo(largestValue);
        });
    });
});