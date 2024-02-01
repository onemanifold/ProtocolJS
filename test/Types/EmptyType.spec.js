describe("EmptyType", () => {
    describe("verify", () => {
        it("should throw an error for non-empty values", () => {
            const emptyType = new EmptyType();
            expect(() => emptyType.verify("non-empty")).toThrow(Error);
            expect(() => emptyType.verify(123)).toThrow(Error);
            expect(() => emptyType.verify(true)).toThrow(Error);
            expect(() => emptyType.verify({ key: "value" })).toThrow(Error);
            expect(() => emptyType.verify([1, 2, 3])).toThrow(Error);
        });

        it("should return the original value for empty values", () => {
            const emptyType = new EmptyType();
            expect(emptyType.verify(null)).toBe(null);
            expect(emptyType.verify(undefined)).toBe(undefined);
            expect(emptyType.verify("")).toBe("");
            expect(emptyType.verify([])).toEqual([]);
        });
    });

    describe("encode", () => {
        it("should not write anything to the buffer", () => {
            const emptyType = new EmptyType();
            const write = jest.fn();
            emptyType.encode(null, write);
            expect(write).not.toHaveBeenCalled();
        });
    });

    describe("decode", () => {
        it("should return undefined", () => {
            const emptyType = new EmptyType();
            const read = jest.fn();
            expect(emptyType.decode(read)).toBe(undefined);
            expect(read).not.toHaveBeenCalled();
        });
    });
});
