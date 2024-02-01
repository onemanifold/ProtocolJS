import  { string, int32, boolean, date, tuple, tag, option } from "./Type.js"
import { StructType } from "./StructType.js"
import { BitStream } from "../../src/BitStream.js"



it("should verify object", () => {
    const book = new StructType({
        title:string,
        isbn:int32,
        illustrated:boolean,
        publicationDate:date,
        genre:tag("fiction", "non-fiction", "Mistery", "Biography", "Sci-Fi", "Fantasy"),
        details:tuple({
            type:option(string, ["Hardcover", "PaperBack", "Ebook", "AudioBook"]),
            specialEdition:boolean,
            pageCount:int16
        })
    })

    book.verify({
        title: "The Mysterious Beyond",
        isbn: 1234567890,  
        illustrated: true,
        publicationDate: new Date("2023-09-21"), 
        genre: "Sci-Fi", 
        details: ["Ebook", false, 512]
    })
    expect(() => new StructType()).toThrow()
    expect(() => book.verify([])).toThrow()
    expect(() => book.verify({})).toThrow()
    expect(() => book.verify({title:()=>{}})).toThrow()
})
