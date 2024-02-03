import { EnumType, StringType, NumberType } from './Type.js';
import { BitStream } from '../../src/BitStream.js';

describe('EnumType', () => {
    let colorEnum;
    let priorityEnum;

    beforeEach(() => {
        // Initialize EnumType instances
        colorEnum = new EnumType(new StringType(), ['Red', 'Green', 'Blue']);
        priorityEnum = new EnumType(new NumberType(), [1, 2, 3]);
    });

    describe('verify', () => {
        it('should accept a valid string option for the color enum', () => {
            expect(() => colorEnum.verify('Red')).not.toThrow();
        });

        it('should throw error for invalid string option for the color enum', () => {
            expect(() => colorEnum.verify('Yellow')).toThrowError(/must be one of/);
        });

        it('should accept a valid number option for the priority enum', () => {
            expect(() => priorityEnum.verify(2)).not.toThrow();
        });

        it('should throw error for invalid number option for the priority enum', () => {
            expect(() => priorityEnum.verify(4)).toThrowError(/must be one of/);
        });
    });

    describe('encode and decode', () => {
        it('should correctly encode and decode a valid option (string)', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const value = 'Green';

            colorEnum.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            const decodedValue = colorEnum.decode(() => stream.read(Math.ceil(Math.log2(colorEnum.options.length))));
            expect(decodedValue).toEqual(value);
        });

        it('should correctly encode and decode a valid option (number)', () => {
            const stream = new BitStream(new Uint8Array(1024));
            const value = 3;

            priorityEnum.encode(value, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            const decodedValue = priorityEnum.decode(() => stream.read(Math.ceil(Math.log2(priorityEnum.options.length))));
            expect(decodedValue).toEqual(value);
        });
    });
});