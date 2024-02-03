import { MaybeType, StringType, NumberType } from './Type.js';
import { BitStream } from '../../src/BitStream.js';

describe('MaybeType', () => {
    let maybeString;
    let maybeNumber;

    beforeEach(() => {
        // Initialize MaybeType instances for strings and numbers
        maybeString = new MaybeType(new StringType());
        maybeNumber = new MaybeType(new NumberType());
    });

    describe('verify', () => {
        it('should accept a string for MaybeType<String>', () => {
            expect(() => maybeString.verify('optional value')).not.toThrow();
        });

        it('should accept null and undefined for MaybeType<String>', () => {
            expect(() => maybeString.verify(null)).not.toThrow();
            expect(() => maybeString.verify(undefined)).not.toThrow();
        });

        it('should accept a number for MaybeType<Number>', () => {
            expect(() => maybeNumber.verify(42)).not.toThrow();
        });

        it('should throw for incorrect type', () => {
            expect(() => maybeString.verify(42)).toThrow(); // Number not allowed for MaybeType<String>
            expect(() => maybeNumber.verify('not a number')).toThrow(); // String not allowed for MaybeType<Number>
        });
    });

    describe('encode and decode', () => {
        it('should encode and decode a present value (string)', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const value = 'hello world';

            maybeString.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            expect(maybeString.decode(() => stream.read(1))).toEqual(value);
        });

        it('should encode and decode null and undefined as null', () => {
            const streamForNull = new BitStream(new Uint8Array(1024));
            const streamForUndefined = new BitStream(new Uint8Array(1024));

            maybeString.encode(null, (val, bitNum) => streamForNull.write(val, bitNum));
            maybeString.encode(undefined, (val, bitNum) => streamForUndefined.write(val, bitNum));

            streamForNull.moveTo(0);
            streamForUndefined.moveTo(0);

            expect(maybeString.decode(() => streamForNull.read(1))).toBeNull();
            expect(maybeString.decode(() => streamForUndefined.read(1))).toBeNull(); // Treats undefined as null
        });

        it('should encode and decode a present value (number)', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const value = 123;

            maybeNumber.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            expect(maybeNumber.decode(() => stream.read(1))).toEqual(value);
        });
    });

    describe('bitSize', () => {
        it('should calculate correct bit size for present values and null', () => {
            // Assuming StringType and NumberType have predefined bit sizes for this example
            expect(maybeString.bitSize('test')).toBeGreaterThan(1); // More than 1 due to the prefix bit + value
            expect(maybeNumber.bitSize(42)).toBeGreaterThan(1); // More than 1 due to the prefix bit + value
            expect(maybeString.bitSize(null)).toBe(1); // Only 1 bit for the prefix, indicating null
            expect(maybeNumber.bitSize(undefined)).toBe(1); // Treats undefined as null, only 1 bit for the prefix
        });
    });
});