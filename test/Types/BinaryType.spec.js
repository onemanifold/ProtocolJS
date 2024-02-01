import { BinaryType } from "../src/BinaryType";

describe("BinaryType", () => {

    it("should encode and decode a Buffer", () => {
        const binary = new BinaryType();
        const buffer = Buffer.from("Hello World");
        const write = jest.fn();
        const read = jest.fn(() => buffer);

        binary.encode(buffer, write);
        expect(write).toHaveBeenCalledWith(buffer);

        expect(binary.decode(read)).toEqual(buffer);
        expect(read).toHaveBeenCalled();
    });

    it("should throw error when encoding non-Buffer value", () => {
        const binary = new BinaryType();
        expect(() => {
        binary.encode("invalid", jest.fn());  
        }).toThrow();
    });

    it("should throw error when decoding non-Buffer value", () => {
        const binary = new BinaryType();
        expect(() => {
        binary.decode(jest.fn(() => "invalid"));
        }).toThrow();
    });

});

