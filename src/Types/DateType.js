
import { Type } from "./Type.js"

// Defining immutability, extensibility, methods, class enforcement (type), etc. Perhaps even serialization/deserialization, pass by copy or by reference, etc.class BooleanInterface extends Interface {} 
export class DateType extends Type {
    constructor() {
        super("object")
    }
    verify(date) {
        super.verify(date) // verify that the value is an object
        if (!(date instanceof Date)) 
            throw(`${date} is not of date type`)
    }

    encode(value, write) {
        this.verify(value) // verify the value
        write(value.getTime(), 53) // encode the date as a 53-bit integer (Number.MAX_SAFE_INTEGER)
    }

    decode(read) {
        var time = read(53) // decode the date as a 53-bit integer 
        return new Date(time) // return the date
    }
}
Object.freeze(DateType)