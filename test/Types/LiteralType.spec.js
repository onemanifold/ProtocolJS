import { LiteralType } from './LiteralType.js';

describe('LiteralType', () => {
    let literalHello;
    let literalNumber;

    beforeEach(() => {
        // Initialize LiteralType instances for a string and a number
        literalHello = new LiteralType("Hello");
        literalNumber = new LiteralType(42);
    });

    describe('verify', () => {
        it('should pass for matching literal value (string)', () => {
            expect(() => literalHello.verify("Hello")).not.toThrow();
        });

        it('should throw error for non-matching value (string)', () => {
            expect(() => literalHello.verify("World")).toThrowError(/is not/);
        });

        it('should pass for matching literal value (number)', () => {
            expect(() => literalNumber.verify(42)).not.toThrow();
        });

        it('should throw error for non-matching value (number)', () => {
            expect(() => literalNumber.verify(43)).toThrowError(/is not/);
        });
    });

    describe('encode and decode', () => {
        it('should not throw when encoding matching value', () => {
            const writeMock = jest.fn();
            expect(() => literalHello.encode("Hello", writeMock)).not.toThrow();
            expect(writeMock).not.toHaveBeenCalled(); // Ensures no encoding operation was performed
        });

        it('should always return the literal value when decoding', () => {
            const readMock = jest.fn();
            expect(literalHello.decode(readMock)).toBe("Hello");
            expect(literalNumber.decode(readMock)).toBe(42);
            expect(readMock).not.toHaveBeenCalled(); // Ensures decode is a no-op for literal values
        });
    });

    describe('toString', () => {
        it('should return a string representation including the literal value', () => {
            expect(literalHello.toString()).toBe('literal("Hello")');
            expect(literalNumber.toString()).toBe('literal(42)');
        });
    });
});