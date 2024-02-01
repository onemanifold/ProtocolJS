import { NilType } from '../src/NilType.js'

describe("NilType", () => {
    describe("verify", () => {
        it("should verify null", () => {
            const nil = new NilType()
            expect(nil.verify(null)).toBe(true)
        })

        it("should not verify undefined", () => {
            const nil = new NilType()
            expect(() => nil.verify(undefined)).toThrow()
        })

        it("should not verify 0", () => {
            const nil = new NilType()
            expect(() => nil.verify(0)).toThrow()
        })

        it("should not verify false", () => {
            const nil = new NilType()
            expect(() => nil.verify(false)).toThrow()
        })

        it("should not verify empty string", () => {
            const nil = new NilType()
            expect(() => nil.verify("")).toThrow()
        })
    })

    describe("encode", () => {
        it("should encode null", () => {
            const write = jest.fn()
            const nil = new NilType()
            nil.encode(null, write)
            expect(write).not.toHaveBeenCalled()
        })

        it("should throw when encoding non-null value", () => {
            const write = jest.fn()
            const nil = new NilType()
            expect(() => nil.encode(0, write)).toThrow()
            expect(write).not.toHaveBeenCalled()
        })
    })

    describe("decode", () => {
        it("should decode null", () => {
            const read = jest.fn(() => null)
            const nil = new NilType()
            expect(nil.decode(read)).toBeNull()
            expect(read).toHaveBeenCalled()
        })

        it("should throw when decoding non-null value", () => {
            const read = jest.fn(() => 0)
            const nil = new NilType()
            expect(() => nil.decode(read)).toThrow()
            expect(read).toHaveBeenCalled()
        })
    })
})