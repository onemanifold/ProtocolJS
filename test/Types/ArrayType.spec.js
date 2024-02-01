import { ArrayType } from "../src/Types/ArrayType.js"; 
import { StringType } from "../src/Types/StringType.js";

describe("ArrayType", () => {

  const stringType = new StringType();

  describe("verify", () => {

    it("should verify a valid array", () => {
      const arrayType = new ArrayType(stringType);
      expect(() => arrayType.verify(["a", "b", "c"])).not.toThrow();
    });

    it("should throw error for non-array input", () => {
      const arrayType = new ArrayType(stringType);
      expect(() => arrayType.verify("abc")).toThrow();
      expect(() => arrayType.verify(123)).toThrow();      
    });

    it("should throw error for array with invalid elements", () => {
      const arrayType = new ArrayType(stringType);
      expect(() => arrayType.verify([1, 2, 3])).toThrow();
    });

  });

});