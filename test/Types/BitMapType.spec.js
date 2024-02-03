import { BitMapType } from "./BitMapType.js";
import { BitStream } from '../../src/BitStream.js';


describe("BitMapType", () => {
    let bitMapType;

    beforeEach(() => {
        bitMapType = new BitMapType();
    });

    it("should verify a valid bit map", () => {
        const validBitMap = [0, 1, 0, 1, 0];
        expect(() => bitMapType.verify(validBitMap)).not.toThrow();
    });

    it("should throw an error for an invalid bit map type", () => {
        const invalidBitMap = "01010";
        expect(() => bitMapType.verify(invalidBitMap)).toThrow(
            "Invalid bit map type. Must be an array of 0s and 1s."
        );
    });

    it("should throw an error for a bit map exceeding the maximum length", () => {
        const longBitMap = Array.from({ length: bitMapType.maxBits + 1 }, () => 0);
        expect(() => bitMapType.verify(longBitMap)).toThrow(
            `Bit map exceeds maximum length of ${bitMapType.maxBits} bits.`
        );
    });

    it("should encode a bit map into a binary format", () => {
        const bitMap = [1, 0, 1, 1, 0];
        const write = jest.fn();
        bitMapType.encode(bitMap, write);
        expect(write).toHaveBeenCalledWith(bitMap.length, expect.any(Number));
        bitMap.forEach((bit) => {
            expect(write).toHaveBeenCalledWith(bit, 1);
        });
    });

    it("should decode a binary format into a bit map", () => {
        const bitMap = [1, 0, 1, 1, 0];
        const read = jest.fn();
        read.mockReturnValueOnce(bitMap.length);
        bitMap.forEach((bit) => {
            read.mockReturnValueOnce(bit);
        });
        const decodedBitMap = bitMapType.decode(read);
        expect(decodedBitMap).toEqual(bitMap);
    });
});


describe('BitMapType', () => {
    let bitMapType;
    let stream;

    beforeEach(() => {
        bitMapType = new BitMapType(1024); // Initialize with a maximum of 1024 bits
        stream = new BitStream(new Uint8Array(128)); // Assuming a buffer large enough for testing
    });

    describe('verify', () => {
        it('should accept a valid bit map', () => {
            const validBitMap = [0, 1, 1, 0, 0, 1];
            expect(() => bitMapType.verify(validBitMap)).not.toThrow();
        });

        it('should throw error for non-array values', () => {
            expect(() => bitMapType.verify("not an array")).toThrowError(/Invalid bit map type/);
        });

        it('should throw error for arrays containing non-bit values', () => {
            const invalidBitMap = [0, 1, 2, 1, 0];
            expect(() => bitMapType.verify(invalidBitMap)).toThrowError(/Invalid bit map type/);
        });

        it('should throw error for bit maps exceeding max length', () => {
            const longBitMap = new Array(1025).fill(0);
            expect(() => bitMapType.verify(longBitMap)).toThrowError(/exceeds maximum length/);
        });
    });

    describe('encode and decode', () => {
        it('should correctly encode and decode a bit map', () => {
            const bitMap = [1, 0, 1, 1, 0, 1, 0, 0];
            bitMapType.encode(bitMap, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            const decodedBitMap = bitMapType.decode(() => stream.read(1));
            expect(decodedBitMap).toEqual(bitMap);
        });
    });

    describe('Edge Cases', () => {
        it('should handle an empty bit map', () => {
            const emptyBitMap = [];
            bitMapType.encode(emptyBitMap, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            const decodedBitMap = bitMapType.decode(() => stream.read(1));
            expect(decodedBitMap).toEqual(emptyBitMap);
        });
    });
});
