import { BitStream } from "../src/BitStream.js"

describe("BitStream", () => {
    describe("constructor", () => {

        it("should throw error if buffer is not Uint8Array", () => {
          expect(() => new BitStream({})).toThrowError();
        });
      
        it("should throw error if buffer is empty", () => {
          expect(() => new BitStream(new Uint8Array(0))).toThrowError();
        });
      
        it("should accept valid buffer", () => {
          const buffer = new Uint8Array(1);
          const stream = new BitStream(buffer);
          expect(stream).toBeDefined();
        });
      
    });

    describe("write and read", () => {
        
        it("should write and read a 4-bit value", () => {
            const buffer = new Uint8Array(1);
            const bitStream = new BitStream(buffer);

            // Write a 4-bit value (binary: 1101, decimal: 13)
            bitStream.write(13, 4);

            // Verify that 4 bits were written
            expect(bitStream.bitSize()).toBe(4);

            bitStream.moveTo(0);
            // Read the 4-bit value
            const readValue = bitStream.read(4);

            // Verify the read value
            expect(readValue).toBe(13);
        });

        it("should write and read a 12-bit value", () => {
            const buffer = new Uint8Array(2);
            const bitStream = new BitStream(buffer);

            // Write a 12-bit value (binary: 110110110110, decimal: 3446)
            bitStream.write(3446, 12);

            // Verify that 12 bits were written
            expect(bitStream.bitSize()).toBe(12);

            bitStream.moveTo(0);
            // Read the 12-bit value
            const readValue = bitStream.read(12);

            // Verify the read value
            expect(readValue).toBe(3446);
        });

        it("should write and read a 9-bit value", () => {
            const buffer = new Uint8Array(2);
            const bitStream = new BitStream(buffer);

            // Write a 9-bit value (binary: 111001101, decimal: 469)
            bitStream.write(469, 9);

            // Verify that 9 bits were written
            expect(bitStream.bitSize()).toBe(9);

            bitStream.moveTo(0);
            // Read the 9-bit value
            const readValue = bitStream.read(9);

            // Verify the read value
            expect(readValue).toBe(469);
        });

        it("should throw error if value is negative", () => {
            const stream = new BitStream(new Uint8Array(1));
            expect(() => stream.write(-1, 1)).toThrowError();
        });
    
        it("should throw error if bits is negative", () => {
            const stream = new BitStream(new Uint8Array(1));
            expect(() => stream.write(1, -1)).toThrowError(); 
        });
    
        it("should expand buffer size if needed", () => {
            const buffer = new Uint8Array(1); 
            const stream = new BitStream(buffer);
            stream.write(1, 9);
            expect(stream.buffer.length).toBeGreaterThan(1);
        });

        it("should handle arbitrary bit lengths", () => {
            const buffer = new Uint8Array(3);
            const bitStream = new BitStream(buffer);

            // Write a 3-bit value (binary: 101, decimal: 5)
            bitStream.write(5, 3);

            // Write a 7-bit value (binary: 1101101, decimal: 109)
            bitStream.write(109, 7);

            // Write a 2-bit value (binary: 01, decimal: 1)
            bitStream.write(1, 2);

            // Verify that 12 bits were written
            expect(bitStream.bitSize()).toBe(12);

            // Move to the beginning
            bitStream.moveTo(0);

            // Read the 3-bit value
            const readValue1 = bitStream.read(3);
            expect(readValue1).toBe(5);

            // Move to the next 7 bits
            bitStream.moveTo(3);

            // Read the 7-bit value
            const readValue2 = bitStream.read(7);
            expect(readValue2).toBe(109);

            // Move to the last 2 bits
            bitStream.moveTo(10);

            // Read the 2-bit value
            const readValue3 = bitStream.read(2);
            expect(readValue3).toBe(1);
        });

        it("should throw error if bits is negative", () => {
            const stream = new BitStream(new Uint8Array(1));
            expect(() => stream.read(-1)).toThrowError();
        });

        it("should return correct size after multiple writes", () => {
            const stream = new BitStream(new Uint8Array(1));
            stream.write(1, 4);
            stream.write(1, 5);
            expect(stream.bitSize()).toBe(9);
        });
    });

    describe("moveTo", () => {

        it("should move to beginning", () => {
          const stream = new BitStream(new Uint8Array(1));
          stream.write(1, 4);
          stream.moveTo(0);
          expect(stream.read(4)).toBe(1);
        });
      
        it("should move to middle", () => {
          const stream = new BitStream(new Uint8Array(2));
          stream.write(1, 4);
          stream.write(2, 4);
          stream.moveTo(4);
          expect(stream.read(4)).toBe(2);
        });
      
        it("should move to end", () => {
          const stream = new BitStream(new Uint8Array(2));
          stream.write(1, 4);
          stream.write(2, 4);
          stream.moveTo(8);
          expect(stream.read(4)).toBe(0); 
        });
      
        it("should throw error if offset is negative", () => {
          const stream = new BitStream(new Uint8Array(1));
          expect(() => stream.moveTo(-1)).toThrow();
        });
        
        it("should throw error if offset is past end", () => {
          const stream = new BitStream(new Uint8Array(1));
          expect(() => stream.moveTo(10)).toThrow();
        });
      
    });

    // Concurrent access
    describe("concurrent access", () => {

        it("should handle concurrent read/write", () => {
            const stream = new BitStream(new Uint8Array(2));
        
            let writeDone = false;
            let readDone = false;
        
            const writePromise = (async () => {
                stream.write(1, 8);
                writeDone = true;
            })();
        
            const readPromise = (async () => {
                await stream.read(8);
                readDone = true;
            })();
        
            return Promise.all([writePromise, readPromise]).then(() => {
                expect(writeDone).toBeTruthy();
                expect(readDone).toBeTruthy();
            });
        });
    
    });  

    // Invalid state
describe("invalid state", () => {

    it("should be robust to read past end", () => {
      const stream = new BitStream(new Uint8Array(1));
      stream.write(1, 4);
      expect(() => stream.read(5)).not.toThrow();
      expect(stream.read(5)).toBe(0);
    });
  
  });
  
  // byteSize()
  describe("byteSize", () => {
  
    it("should return correct byte size after multiple writes", () => {
      const stream = new BitStream(new Uint8Array(2));
      stream.write(1, 4); 
      stream.write(2, 12);
      expect(stream.byteSize()).toBe(2);
    });
  
  });
  
});

describe("BitStream", () => {
    it("should write and read bits correctly", () => {
        const buffer = new Uint8Array(1); // Initialize a buffer to write on
        const bitStream = new BitStream(buffer);

        // Write some bits to the bitStream
        bitStream.write(1, 1); // Write a single bit (1)
        bitStream.write(0b1101, 4); // Write 4 bits (1101)

        // Verify the bitStream's length
        expect(bitStream.length).toBe(1); // 1 byte is written

        // Read back the written bits
        bitStream.moveTo(0); // Move to the beginning
        const bit1 = bitStream.read(1);
        const bits4 = bitStream.read(4);

        // Verify the read values
        expect(bit1).toBe(1);
        expect(bits4).toBe(0b1101);
    });

    it("should handle arbitrary bit lengths", () => {
        const buffer = new Uint8Array(1); // Initialize a buffer to write on (can not be empty)
        const bitStream = new BitStream(buffer);

        // Write bits with arbitrary lengths
        bitStream.write(0b101010, 6);
        bitStream.write(0b111, 3);

        // Read back the written bits
        bitStream.moveTo(0);
        const bits6 = bitStream.read(6);
        const bits3 = bitStream.read(3);

        expect(bits6).toBe(0b101010);
        expect(bits3).toBe(0b111);
    });

    it("should handle non-standard bit lengths", () => {
        const buffer = new Uint8Array(1); // Initialize a buffer to write on
        const bitStream = new BitStream(buffer);

        // Write bits with non-standard lengths
        bitStream.write(0b101010, 6);
        bitStream.write(0b111, 3);
        bitStream.write(0b101, 3);

        // Read back the written bits
        bitStream.moveTo(0);
        const bits6 = bitStream.read(6);
        const bits3_1 = bitStream.read(3);
        const bits3_2 = bitStream.read(3);

        expect(bits6).toBe(0b101010);
        expect(bits3_1).toBe(0b111);
        expect(bits3_2).toBe(0b101);
    });

    it("should handle non-standard bit lengths", () => {
        const buffer = new Uint8Array(1); // Initialize a buffer to write on
        const bitStream = new BitStream(buffer);

        // Write bits with non-standard lengths
        bitStream.write(0b101010, 6);
        bitStream.write(0b111, 3);
        bitStream.write(0b101, 3);

        // Read back the written bits
        bitStream.moveTo(0);
        const bits6 = bitStream.read(6);
        const bits3_1 = bitStream.read(3);
        const bits3_2 = bitStream.read(3);

        expect(bits6).toBe(0b101010);
        expect(bits3_1).toBe(0b111);
        expect(bits3_2).toBe(0b101);
    });
});

describe("BitStream", () => {

    describe("write", () => {
  
        it("should write 0 bits", () => {
            const bitStream = new BitStream(new Uint8Array(1));
            bitStream.write(10, 0); 
            expect(bitStream.bitSize()).toBe(0);
        });
    
        it("should write up to 8 bits in a byte", () => {
            const bitStream = new BitStream(new Uint8Array(1));
            bitStream.write(0b10101010, 8);
            expect(bitStream.bitSize()).toBe(8);
        });
    
        it("should write across byte boundaries", () => {
            const bitStream = new BitStream(new Uint8Array(2));
            bitStream.write(0b1010101010101010, 16); 
            expect(bitStream.bitSize()).toBe(16);
        });
  
    });
  
    describe("read", () => {
  
        it("should read 0 bits", () => {
            const bitStream = new BitStream(new Uint8Array(1));
            expect(bitStream.read(0)).toBe(0);
        });
  
        it("should read up to 8 bits from a byte", () => {
            const buffer = new Uint8Array(1);
            buffer[0] = 0b10101010;
            const bitStream = new BitStream(buffer);
            expect(bitStream.read(8)).toBe(0b10101010);
        });
  
        it("should read across byte boundaries", () => {
            const buffer = new Uint8Array(2);
            buffer[0] = 0b10101010;
            buffer[1] = 0b01010101;
            const bitStream = new BitStream(buffer);
            expect(bitStream.read(16)).toBe(0b1010101001010101);
        });
  
    });
  
  });