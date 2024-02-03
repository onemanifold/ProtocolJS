import  { string, int32, boolean, date, tuple, tag, option } from "./Type.js"
import { StructType } from "./StructType.js"
import { BitStream } from "../../src/BitStream.js"


escribe("StructType", () => {
    it("should verify a complex object structure", () => {
        const bookStruct = new StructType({
            title: string,
            isbn: int32,
            illustrated: boolean,
            publicationDate: date,
            genre: tag("fiction", "non-fiction", "Mystery", "Biography", "Sci-Fi", "Fantasy"),
            details: tuple({
                type: option(string, ["Hardcover", "Paperback", "Ebook", "Audiobook"]),
                specialEdition: boolean,
                pageCount: int16
            })
        });

        const book = {
            title: "The Mysterious Beyond",
            isbn: 1234567890,
            illustrated: true,
            publicationDate: new Date("2023-09-21"),
            genre: "Sci-Fi",
            details: ["Ebook", false, 512]
        };

        expect(() => bookStruct.verify(book)).not.toThrow();
        expect(() => new StructType()).toThrow("No properties provided, a struct type must always define its shape.");
        expect(() => bookStruct.verify([])).toThrow("Object is not a hash map!");
        expect(() => bookStruct.verify({})).toThrow("Object does not have a property with the name");
        expect(() => bookStruct.verify({ title: () => {} })).toThrow("Structs cannot have functions as properties");
    });

    it("should encode and decode a struct", () => {
        const simpleBookStruct = new StructType({
            title: string,
            illustrated: boolean
        });

        const stream = new BitStream();
        const obj = {
            title: "Treasure Island",
            illustrated: true
        };

        simpleBookStruct.encode(obj, stream.write.bind(stream));
        stream.moveTo(0);
        const decodedObj = simpleBookStruct.decode(stream.read.bind(stream));
        expect(decodedObj).toEqual(obj);
    });

    // Edge cases
    describe("Edge Cases", () => {
        it("should handle empty structs", () => {
            const emptyStruct = new StructType({});
            const obj = {};
            expect(() => emptyStruct.verify(obj)).not.toThrow();
        });

        it("should fail for structs with missing required properties", () => {
            const personStruct = new StructType({
                name: string,
                age: int32
            });

            const incompletePerson = {
                name: "John Doe"
                // Missing age
            };
            expect(() => personStruct.verify(incompletePerson)).toThrow("Object does not have a property with the name");
        });

        it("should fail for structs with properties of incorrect type", () => {
            const personStruct = new StructType({
                name: string,
                age: int32
            });

            const wrongTypePerson = {
                name: "John Doe",
                age: "Twenty" // Incorrect type, should be int32
            };
            expect(() => personStruct.verify(wrongTypePerson)).toThrow();
        });

        it("should correctly calculate bit size for encoding", () => {
            // Assuming the existence of a bitSize method on types
            const bitSizeStruct = new StructType({
                flag: boolean,
                number: int32
            });

            const obj = {
                flag: true,
                number: 12345
            };
            // This is a conceptual test; actual implementation may vary depending on how bitSize is implemented
            // Assuming boolean is 1 bit and int32 is 32 bits, total should be 33 bits
            expect(bitSizeStruct.bitSize(obj)).toBe(33);
        });
    });
});
