import { TupleType, int16, boolean, date, string, tag } from "../src/TupleType.js";
import { BitStream } from "../../src/BitStream.js"


it("should verify tupple", () => {
    const bugReport = new TupleType({
        issueId:int16,
        severity:tag("Critical", "High", "Medium", "Low", "Trivial"),
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

    expect(() => new TupleType({})).toThrow() 
})