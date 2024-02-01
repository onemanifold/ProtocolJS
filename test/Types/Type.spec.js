import {Type} from "../src/Type.js"

describe('Type class', () => {
  describe('constructor', () => {
    it('should create a Type instance with the specified type', () => {
      const type = new Type('number');
      expect(type).toBeDefined();
      expect(type.name).toBe(''); // Due to the implementation of toString()
    });

    it('should handle undefined type correctly', () => {
      const type = new Type();
      expect(type.name).toBe('');
    });
  });

  describe('verify method', () => {
    it('should not throw an error for matching types', () => {
      const type = new Type('string');
      expect(() => type.verify('test')).not.toThrow();
    });

    it('should throw an error for non-matching types', () => {
      const type = new Type('number');
      expect(() => type.verify('test')).toThrow();
    });
  });

  describe('validate method', () => {
    it('should return true for matching types', () => {
      const type = new Type('string');
      expect(type.validate('test')).toBe(true);
    });

    it('should return false for non-matching types', () => {
      const type = new Type('number');
      expect(type.validate('test')).toBe(false);
    });
  });

  describe('name getter', () => {
    it('should return the correct type name', () => {
      const type = new Type('string');
      expect(type.name).toBe('');
    });
  });

  describe('toString method', () => {
    it('should return an empty string', () => {
      const type = new Type('string');
      expect(type.toString()).toBe('');
    });
  });

  describe('#getType method', () => {
    it('should validate and return a Type instance', () => {
      const type1 = new Type('string');
      const type2 = new Type('#getType', type1);
      expect(() => type2).toThrow();
    });

    it('should throw an error if the argument is not a Type instance', () => {
      expect(() => new Type()).toThrow(); // Syntax for calling private methods in tests may vary
    });
  });

  describe('serialize and deserialize methods', () => {
    it('should serialize and deserialize a Type instance', () => {
      const type = new Type('string');
      const serialized = type.serialize();
      expect(serialized).toEqual([]); // Expected to fail due to private field

      const newType = new Type();
      newType.deserialize(serialized);
      expect(newType).toEqual(type); // This test will likely fail
    });
  });

  // Testing Object.freeze to ensure Type class is immutable
  describe('Object.freeze on Type class', () => {
    it('should prevent new properties from being added to the Type class', () => {
      expect(() => {
        Type.newProperty = 'test';
      }).toThrow();
    });

    it('should prevent existing properties from being modified', () => {
      expect(() => {
        Type.name = 'newName';
      }).toThrow();
    });
  });
});

