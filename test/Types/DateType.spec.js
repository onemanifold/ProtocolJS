import { DateType } from './DateType.js';
import { BitStream } from '../../src/BitStream.js';

describe('DateType', () => {
    let dateType;
    let stream;

    beforeEach(() => {
        dateType = new DateType();
        stream = new BitStream(new Uint8Array(1024)); // Assuming a buffer large enough for testing
    });

    describe('verify', () => {
        it('should pass for Date object', () => {
            const date = new Date();
            expect(() => dateType.verify(date)).not.toThrow();
        });

        it('should throw error for non-Date type', () => {
            const notADate = "2023-09-20";
            expect(() => dateType.verify(notADate)).toThrow(/is not of date type/);
        });
    });

    describe('encode and decode', () => {
        it('should correctly encode and decode a Date object', () => {
            const date = new Date('2023-09-20T00:00:00Z');
            dateType.encode(date, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0); // Reset to start for reading
            const decodedDate = dateType.decode(() => stream.read(53));
            expect(decodedDate).toEqual(date);
        });
    });

    describe('Edge Cases', () => {
        it('should handle dates at the edge of JavaScript date range', () => {
            const earliestDate = new Date(-8640000000000000);
            const latestDate = new Date(8640000000000000);
            
            // Testing earliest date
            stream = new BitStream(new Uint8Array(1024)); // Reset stream for new test
            dateType.encode(earliestDate, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            let decodedDate = dateType.decode(() => stream.read(53));
            expect(decodedDate).toEqual(earliestDate);

            // Testing latest date
            stream = new BitStream(new Uint8Array(1024)); // Reset stream for new test
            dateType.encode(latestDate, (val, bitNum) => stream.write(val, bitNum));
            stream.moveTo(0);
            decodedDate = dateType.decode(() => stream.read(53));
            expect(decodedDate).toEqual(latestDate);
        });

        it('should throw an error for invalid date encoding', () => {
            // Simulating an invalid date by writing an out-of-range value
            const invalidTime = Number.MAX_SAFE_INTEGER + 1;
            stream.write(invalidTime, 53);
            stream.moveTo(0);
            expect(() => dateType.decode(() => stream.read(53))).toThrow();
        });
    });
});