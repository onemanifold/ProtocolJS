import { BooleanType } from "../src/Types/BooleanType.js";
import { BitStream } from "../src/BitStream.js";

describe("BooleanType", () => {

    it("should encode and decode true", () => {
        const booleanType = new BooleanType();
        const stream = new BitStream();

        booleanType.encode(stream.write, true);
        stream.moveTo(0);
        expect(booleanType.decode(stream.read)).toBe(true);
    });

    it("should encode and decode false", () => {
        const booleanType = new BooleanType();
        const stream = new BitStream();

        booleanType.encode(stream.write, false);
        stream.moveTo(0);
        expect(booleanType.decode(stream.read)).toBe(false);
    });

    it("should throw error when encoding non-boolean value", () => {
        const booleanType = new BooleanType();
        const stream = new BitStream();

        expect(() => booleanType.encode(stream.write, 123)).toThrow();
    });

    it("should throw error when decoding invalid boolean encoding", () => {
        const booleanType = new BooleanType();
        const stream = new BitStream();
        stream.write(2); // Invalid encoding

        expect(() => booleanType.decode(stream.read)).toThrow();
    });

});