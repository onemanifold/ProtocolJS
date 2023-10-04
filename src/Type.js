/**
 * 
 */
export class Type {
    type
    constructor(type) {
        if ( type !== undefined ) 
             this.type = type
    }

    verify(value) {
        if ( this.type 
            && value !== undefined
            && value !== null
            && typeof value !== this.type )
                throw(new Error(`${value} is not of ${this.type} type`))
    }

    get name() {
        return this.constructor.name.toLowerCase().replace('type', '')
    }

    getType(type) {
        if (!type instanceof Type )
            throw(`"${type}" is not a type`)
        return type
    }

    toString() {
        return this.constructor.name
    }
}
Object.freeze(Type)

/**
 * 
 */
export class ValueType extends Type {
    constructor(value) {
        super(typeof value)
        this.value = value
    }
    verify(value) {
        super.verify(value)
        if ( value !== this.value ) throw(`${value} is not ${this.value}`)
    }
}

/**
 * 
 */
export class NilType extends Type {
    verify(value) {
        if ( value !== null   // If value is not null
            && value !== undefined ) // or it is not undefined
            throw(`value of "${value}" is not nil`)   // throw error
        return value
    }
}
Object.freeze(NilType)


/**
 * 
 */
export class StringType extends Type {
    constructor() { 
        super('string') 
    }
}
Object.freeze(StringType)

/**
 * 
 */
export class NumberType extends Type {
    bits = 32 // In bits, it can become a bigInt instead of an Int
    /**
     * 
     * @param {*} maxSize 
     */
    constructor(bits = 32) {
        super("number")
        this.bits = bits
    }

    verify(number) {
        super.verify(number)
        if ( ( number > ( Math.pow(2, this.bits - 1) - 1 ) )
        || ( number < ( 1 - Math.pow(2, this.bits - 1) ) ) ) 
            throw(`${number} is out of range for a ${this.bits}-bit signed integer`);
    }
}
Object.freeze(NumberType)

/**
 * 
 */
export class BooleanType extends Type {
    constructor() {
        super("boolean")
    }
}
Object.freeze(BooleanType)


/**
 * Map has not methods, and they can be "passed" by copy across trust boundaries, also, they may be immutable if they are defined as part of an type
 * - Are non extensible: properties/methods can not be removed, types represent "shape" contracts
 * - 
 */
export class MapType extends Type {
    propertyTypes = {}
    /**
     * 
     * @param {*} propertyTypes
     */
    constructor(propertyTypes) {
        super('object')                          // Calling super to set this.type to 'object'
        if ( propertyTypes !== undefined )       // If the propertyTypes argument is not undefined,
            this.setPropertyTypes(propertyTypes) // Initialize property types
        else throw('No properties provided, a hashmap type must always define its shape')
    }

    /**
     * 
     * @param {*} propertyTypes
     * @returns 
     */
    setPropertyTypes(propertyTypes) {
        var names = Object.keys(propertyTypes)
        for (let name of names )                                         // For every property Type name
        {
            this.propertyTypes[name] = this.getType(propertyTypes[name])              // retrieve property Type corresponding to that name,
        }
        Object.freeze(this.propertyTypes)
        return this                                                                  // return type object to enable method chaining
    }

    /**
     * 
     * @param {*} object 
     * @returns 
     */
    verify(object) {
        super.verify(object)
        if ( Object.getPrototypeOf(object) !== Object.prototype )
            throw("Object is not a hash map!")
        for ( let name in this.propertyTypes )
        {
            if ( !object.hasOwnProperty(name) )  // Object must at least have the property name
                throw(`Object does not have a property with the name "${name}"`)
            let propertyValue = object[name]
            if ( propertyValue instanceof Function )
                throw(`Objects of hashmap type can not have functions`)
            let type = this.propertyTypes[name]
            type.verify(propertyValue)
        }
        return object
    }

    /**
     * 
     * @param {*} descriptor 
     * @returns 
     */
    getType(type) {
        if ( type instanceof FunctionType ) 
            throw("dictionaries can not have functions as properties")
        return super.getType(type)
    }
}
Object.freeze(MapType)


/**
 * 
 */
export class ArrayType extends Type { // Or list?
    itemType
    constructor(itemType) {
        super("object")
        this.itemType = itemType
    }
    verify(array) {
        super.verify(array) // can be an array, or any iterable, it will be passed by copy
        for ( let value of array )
            this.itemType.verify(value)
    }
}
Object.freeze(ArrayType)

/**
 * 
 */
export class TupleType extends Type { //immutable
    types
    constructor(types) {
        super("object")
        if ( Object.keys(types).length < 2 ) 
            throw("Tupple type must define at least two values")
        this.types = types
    }

    verify(tuple) {
        var typesArray = Object.values(this.types)
        if ( tuple.length !== typesArray.length ) 
            throw(`${tuple} has wrong size`)
        for ( let index in typesArray )
            typesArray[index].verify(tuple[index])
    }
}

// Defining immutability, extensibility, methods, class enforcement (type), etc. Perhaps even serialization/deserialization, pass by copy or by reference, etc.class BooleanInterface extends Interface {} 
export class DateType extends Type {
    constructor() {
        super("object")
    }
    verify(date) {
        super.verify(date)
        if ( !date instanceof Date) 
            throw(`${date} is not of date type`)
    }
}
Object.freeze(DateType)

/**
 * 
 */
export class EnumType extends Type {
    types = {}
    constructor(types) {
        super()
        this.types = types
    }
    verify(option) {
        const typesKeys = ( !this.types instanceof Array ) ? Object.keys(this.types) : Object.values(this.types)
        const typesValues = Object.values(this.types)
        var matched = false
        for ( let i in typesValues )
        {    
            try {
                typesValues[i].verify(option)
                matched = true
                break
            } catch (e) {}
        }
        if (!matched) 
            throw(`"${option}" must be a one of [${typesKeys}]`)
    }
}

/**
 * Functions Type 
 * TODO: Verify properly for rest parameters, right now it is only property
 */
export class FunctionType extends Type {
    parameterNames = []
    parameterTypes = {}
    restType = undefined 
    returnType = undefined
    /**
     * 
     * @param {Type[]} types
     */
    constructor(types) {
        super('function')
        this.setReturnType(types.return)
        this.setParameterTypes(types.parameters)
    }

    getFunctionParameters(functionObject) {
        const match = functionObject.toString().match(/(?:function\s.*?\(([^)]*)\))|(?:.*?\(([^)]*)\))|(?:([^=\s]*)\s*=>)/)
        const paramStr = (match[1] || match[2] || match[3] || '').trim() //??
        return paramStr ? paramStr.split(/\s*,\s*/) : []
    }
    // TODO: modify to iterate in indexes, and check property index is last for the ...rest property if present
    setParameterTypes(parameterTypes) {
        for ( let name in parameterTypes )                                     // for every name in the parameter types argument
            if ( name.substring(0,3) === "..." )                               // processing rest type
                this.parameterTypes[name] = array(parameterTypes[name])
            else 
                this.parameterTypes[name] = parameterTypes[name] // set the internal parameter type with the same name to that of the argument
        
        this.parameterNames = Object.keys(parameterTypes)         
        return this                                                            // return this to enable method chaining
    }

    setReturnType(returnType) {
        this.returnType = returnType
        return this
    }

    //TODO: Support more robust parameter signatures, inclusive not only of name, but also rest and destructuring
    verify(functionObject) {
        super.verify(functionObject)                                              // verify that the value is a function (specially when wrapping)
        // var parameters = this.getFunctionParameters(functionObject)               // retrieve function parameter names
        // if ( parameters.length !== this.parameterNames.length                     // If the function parameter names length is not the same as those of this type
        //     || parameters.join() !== this.parameterNames.join() )                 // or parameters are not the same
        //     throw(`function parameters do not match type`)                        // throw error
    }

    verifyArguments(functionArguments) {
        if ( functionArguments.length !== this.parameterNames.length )           // and the paramter names count does not match the arguments count
            throw("Number of parameters does not match the function protocol")
        if ( this.parameterTypes.length )                                        // If there are any parameters requires
            for ( let parameterName in this.parameterTypes )                     // for every parameter index in the internal parameter types array
            {
                let parameterType = this.parameterTypes[parameterName]           // Get parameter type that corresponds to that index
                let parameterValue = functionArguments[parameterName]            // function argument that corresponds to that index
                parameterType.verify(parameterValue)                             // verify argument with the type, this will throw if there are any errors
            }
        return functionArguments                                                 // Returning arguments, so they can be passed directly to the function
    }

    apply(functionObject, thisObj, args) {
        this.verify(functionObject)
        this.verifyArguments(args)                                // verify the arguments match the method's signature
        var returnValue = functionObject.apply(thisObj, args)     // execute function and store return value
        this.returnType.verify(returnValue)                       // verify the return value matches the methods signature
        return returnValue                                        // return the verified value
    } 
}



/** */
export const nil = new NilType()
export const boolean = new BooleanType()
export const int8 = new NumberType(8)
export const int16 = new NumberType(16)
export const int32 = new NumberType(32)
export const int8Array = new ArrayType(int8)
export const int16Array = new ArrayType(int16)
export const int32Array = new ArrayType(int32)
export const string = new StringType()
export const date = new DateType()
export const empty = new ValueType(undefined)

  
export const tuple = (typesObject) => new TupleType(typesObject)
export const option = (types) => new EnumType(types)
export const number = (size) => new NumberType(size) // size in bits (can create big ints)

export const array = (type) => new ArrayType(type) // size in items
export const object = (propertyTypes) => new MapType(propertyTypes) // any object, vs properties?
export const hashmap = object
export const lambda = (parameters = [], returnType = empty) => new FunctionType({parameters, return:returnType}) // this is a function, that is not necessarily bound, an arrow function
export const method = lambda
export const call = lambda
export const value = (value) => new ValueType(value)
export const values = (...values) => values.map(v=>value(v))
export const literal = value
export const invariant = value