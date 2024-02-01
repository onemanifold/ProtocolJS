import { EnumType } from "../src/EnumType.js"
import { BitStream } from "../../src/BitStream.js"

it("should verify an option/enum", () => { 
    const type = option(string, ["big","small"])
    type.verify("big")
    type.verify("small")
    expect(() => type.verify("medium")).toThrow()
})
