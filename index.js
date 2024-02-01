import { Protocol } from "./src/Protocol.js"
import { Interface } from "./src/Interface.js"
import { Model } from "./src/Model.js"
export { Protocol, Interface, Model }


import { EmptyType } from "./src/Types/EmptyType.js"
import { NilType } from "./src/Types/NilType.js"
import { BooleanType } from "./src/Types/BooleanType.js"
import { StringType } from "./src/Types/StringType.js"
import { StructType } from "./src/Types/StructType.js"
import { ArrayType } from "./src/Types/ArrayType.js"
import { DateType } from "./src/Types/DateType.js"
import { BinaryType } from "./src/Types/BinaryType.js"
//import { PrimitiveType } from "./PrimitiveType.js"

import { TupleType } from "./src/Types/TupleType.js"
import { EnumType } from "./src/Types/EnumType.js"
import { EitherType } from "./src/Types/EitherType.js"
import { MaybeType } from "./src/Types/MaybeType.js"
import { LiteralType } from "./src/Types/LiteralType.js"
import { FloatType } from "./src/Types/FloatType.js"
import { IntegerType } from "./src/Types/IntegerType.js"
import { DoubleType } from "./src/Types/DoubleType.js"

const NumberType = null
const PrimitiveType = null
const ValueType = null

export { EmptyType, NilType, BooleanType, NumberType, StringType, StructType, ArrayType, DateType, BinaryType, PrimitiveType, TupleType, EnumType, EitherType, MaybeType, ValueType, IntegerType}

export const maybe = (type) => new MaybeType(type)
export const tuple = (...types) => new TupleType(types.length === 1 ? types[0] : types)
export const either = (...types) => new EitherType(types) //any of the following types
export const option = (type, options) => new EnumType(type, options)
export const tag = (...options)=> new EnumType(string, options)
export const literal = (value) => new LiteralType(value)

/** */
export const empty = new EmptyType()
export const nil = new NilType()
export const boolean = new BooleanType()
export const int = new IntegerType()
export const uInt = int.unsigned()

export const int8 = int.bits(8)
export const int16 = int.bits(16)
export const int32 = int.bits(32)

export const uInt8 = uInt.bits(8)
export const uInt16 = uInt.bits(16)
export const uInt32 = uInt.bits(32)

export const float = new FloatType()
export const double = new DoubleType()

export const string = new StringType()
export const date = new DateType()
export const number = either(uInt, int, float, double)

export const primitive = either(nil, boolean, string, number, date, empty)
export const array = new ArrayType(primitive)

export const int8Array = new ArrayType(int8)
export const int16Array = new ArrayType(int16)
export const int32Array = new ArrayType(int32)

export const uInt8Array = new ArrayType(uInt8)
export const uInt16Array = new ArrayType(uInt16)
export const uInt32Array = new ArrayType(uInt32)



export const binary = new BinaryType()
export const struct = (propertyTypes) => new StructType(propertyTypes) // any object, vs properties?

export const lambda = (parameters = [], returnType = empty) => new FunctionType({parameters, return:returnType}) // this is a function, that is not necessarily bound, an arrow function
export const method = lambda
export const call = lambda
export const value = literal
export const invariant = value