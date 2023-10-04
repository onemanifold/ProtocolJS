import { 
    nil, boolean, 
    int8, int16, int32, 
    string, date, value, values,
    tuple, option, object, array,
    int8Array, int16Array, int32Array,
    method
} from "../src/Type.js"


it("should verify a nil", () => {
    nil.verify(null)
    expect(() => nil.verify(true)).toThrow();
})

it("should verify a value", () => {
    var big = value("big")
    big.verify("big")
    expect(() => nil.verify(true)).toThrow();
})

it("should verify a boolean", () => {
    boolean.verify(true)
    boolean.verify(false)
    expect(() => nil.verify(5)).toThrow()
})

it("should verify an 8 bit integer", () => {
    int8.verify(0)
    int8.verify(-127)
    int8.verify(127)
    expect(() => int8.verify(128)).toThrow()
    expect(() => int8.verify(-129)).toThrow()
})

it("should verify an 16 bit integer", () => {
    int16.verify(0)
    int16.verify(-32767)
    int16.verify(32767)
    expect(() => int16.verify(-32769)).toThrow()
    expect(() => int16.verify(32768)).toThrow()
})

it("should verify an 32 bit integer", () => {
    int32.verify(0)
    int32.verify(-2147483647)
    int32.verify(2147483647)
    expect(() => int32.verify(-2147483649)).toThrow()
    expect(() => int32.verify(2147483648)).toThrow()
})

it("should verify a string", () => {
    string.verify("This is a string")
    expect(() => string.verify({})).toThrow();
})

it("should verify a date", () => {
    date.verify(new Date())
})

it("should verify an int8 typed array", () => {
    int8Array.verify([126,12,13,120,127,126])
    expect(() => int8Array.verify([128,-129])).toThrow()
})

it("should verify an int16 typed array", () => {
    int16Array.verify([126,12,13,120,127,126,32767])
    expect(() => int16Array.verify([32767,-32768])).toThrow()
})

it("should verify an int16 typed array", () => {
    int32Array.verify([126,12,13,120,127,126, 32767, -2147483647, 2147483646])
    expect(() => int32Array.verify([32767,2147483648])).toThrow()
})

it("should verify an option/enum", () => { 
    const type = option([string, int8])
    type.verify("This is a string")
    type.verify(5)
    expect(() => type.verify(false)).toThrow()
    expect(() => type.verify([])).toThrow() 
})

it("should verify tupple", () => {
    const bugReport = tuple({
        issueId:int16,
        severity:option(values("Critical", "High", "Medium", "Low", "Trivial")),
        isResolved:boolean,
        ReportedDate:date,
        description:string,
    })

    bugReport.verify([
        101,
        "High",
        false,
        new Date('2023-09-20'),
        "API returns a 500 error when submitting data with special characters."
    ])
    expect(() => bugReport.verify([
        101,
        "High",
        false,
        new Date('2023-09-20')
    ])).toThrow() 

    expect(() => tuple({})).toThrow() 
})

it("should verify object", () => {
    const book = object({
        title:string,
        isbn:int32,
        illustrated:boolean,
        publicationDate:date,
        genre:option(values("fiction", "non-fiction", "Mistery", "Biography", "Sci-Fi", "Fantasy")),
        details:tuple({
            type:option(values("Hardcover", "PaperBack", "Ebook", "AudioBook")),
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
    expect(() => book.verify([])).toThrow()
    expect(() => book.verify({})).toThrow()
    expect(() => book.verify({title:()=>{}})).toThrow()
})

it("should verify array", () => {
    const stringArray = array(string)
    stringArray.verify(["This", "is", "a", "string", "array"])
})
// TODO: Test for rest parameters and destructuring signatures
it("should verify a function signature", () => {
    const signature = method({subject:string}, string) 
    function greet(subject) { 
        return `Hello ${subject}!`
    }
    signature.apply(greet, null, ["world"])
})



