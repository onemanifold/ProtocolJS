import { TupleType } from "../src/TupleType.js";
import { BitStream } from "../../src/BitStream.js";
import { int16, boolean, date, string, tag } from "./Type.js";

describe("TupleType", () => {
    let bugReportType;

    beforeEach(() => {
        // Define a tuple type for bug reports
        bugReportType = new TupleType({
            issueId: int16,
            severity: tag("Critical", "High", "Medium", "Low", "Trivial"),
            isResolved: boolean,
            reportedDate: date,
            description: string,
        });
    });

    it("should verify a tuple with correct structure and types", () => {
        const bugReport = [
            101,
            "High",
            false,
            new Date('2023-09-20'),
            "API returns a 500 error when submitting data with special characters."
        ];
        expect(() => bugReportType.verify(bugReport)).not.toThrow();
    });

    it("should throw an error for tuples with incorrect length", () => {
        const incompleteBugReport = [
            101,
            "High",
            false,
            new Date('2023-09-20')
            // Missing 'description'
        ];
        expect(() => bugReportType.verify(incompleteBugReport)).toThrow();
    });

    it("should throw an error for tuples with incorrect element types", () => {
        const incorrectBugReport = [
            "101", // Should be an int16, not a string
            "High",
            false,
            new Date('2023-09-20'),
            "API returns a 500 error when submitting data with special characters."
        ];
        expect(() => bugReportType.verify(incorrectBugReport)).toThrow();
    });

    it("should encode and decode a tuple correctly", () => {
        const stream = new BitStream();
        const bugReport = [
            102,
            "Medium",
            true,
            new Date('2023-09-21'),
            "Session timeout is not handled properly."
        ];

        bugReportType.encode(bugReport, stream.write.bind(stream));
        stream.moveTo(0);
        const decodedBugReport = bugReportType.decode(stream.read.bind(stream));
        expect(decodedBugReport).toEqual(expect.arrayContaining(bugReport));
    });

    // Testing edge cases
    describe("Edge Cases", () => {
        it("should throw an error when initializing with less than two types", () => {
            expect(() => new TupleType({issueId: int16})).toThrow();
        });

        it("should handle tuples with maximum allowed elements", () => {
            // Assuming a hypothetical scenario where the maximum elements are not restricted,
            // as the TupleType constructor does not enforce a maximum limit
            const largeTuple = new TupleType({
                issueId: int16,
                severity: tag("Critical", "High", "Medium", "Low", "Trivial"),
                isResolved: boolean,
                reportedDate: date,
                description: string,
                additionalInfo: string, // Added another field for demonstration
            });
            const largeBugReport = [
                103,
                "Low",
                true,
                new Date('2023-09-22'),
                "Minor UI glitch on settings page.",
                "Occurs on mobile viewports only."
            ];
            expect(() => largeTuple.verify(largeBugReport)).not.toThrow();
        });

        it("should throw an error for tuples containing undefined or null elements", () => {
            const bugReportWithUndefined = [
                104,
                undefined, // Severity is undefined
                false,
                new Date('2023-09-23'),
                "Missing severity level."
            ];
            expect(() => bugReportType.verify(bugReportWithUndefined)).toThrow();

            const bugReportWithNull = [
                105,
                "High",
                null, // isResolved is null
                new Date('2023-09-24'),
                "Null value for boolean type."
            ];
            expect(() => bugReportType.verify(bugReportWithNull)).toThrow();
        });
    });
});