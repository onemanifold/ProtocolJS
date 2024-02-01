import { StringType } from "../src/StringType.js";
import { BitStream } from "../../src/BitStream.js"

it("should verify a string", () => {
    var string = new StringType()
    string.verify("This is a string")
    expect(() => string.verify({})).toThrow();
})