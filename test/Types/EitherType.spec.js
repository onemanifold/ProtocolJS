import { EitherType } from "../src/EitherType.js";
import { StringType } from "../src/StringType.js";
import { IntegerType } from "../src/IntegerType.js";

describe("EitherType", () => {

    const stringType = new StringType(10);
    const int8Type = new IntegerType(8);

    it("should verify string value", () => {
        const type = new EitherType(string, number);
        expect(() => type.verify("Hello")).not.toThrow();
    });

    it("should verify number value", () => {  
        const type = new EitherType(string, number);
        expect(() => type.verify(123)).not.toThrow();
    });

    it("should throw error for boolean value", () => {
        const type = new EitherType(string, number);
        expect(() => type.verify(true)).toThrow();
    });

    it("should throw error for array value", () => {
        const type = new EitherType(string, number);
        expect(() => type.verify([1,2,3])).toThrow();
    });

});
