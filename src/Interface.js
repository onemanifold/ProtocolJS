import { FunctionType } from "../src/Type.js"
/**
 * 
 */
class Interface {
    protocol
    /**
     * 
     * @param {*} protocol  
     */
    constructor(protocol) {
        if (protocol) this.protocol = protocol
    }
    static protocol = Symbol('protocol')
}

Object.freeze(Interface)
Object.freeze(Interface.prototype)

/**
 * TODO: Make this the interface of the object protocol
 * Create a new inboundInterface for the Object protocol
 */
export class InboundInterface extends Interface {
    apply
    constructor(protocol, object) {
        super(protocol)
        protocol.verify(object)
        this.apply = (name, args = []) => {
            const type = protocol.propertyTypes[name]          // retrieve the property type with that property name
            if ( type instanceof FunctionType )                // if the property type is a method type, pass the object, the property name
                return type.apply(object[name], object, args)  // Applying arguments to method in a type verified way
            else if  ( args.length === 0 )                     // If there are no arguments
                return object[name]                            // It is a property get call
            else throw (`Invalid protocol message: ${name}`)   // otherwise, it is a protocol violation and it must throw
        }
        Object.freeze(this)
    }
}
Object.freeze(InboundInterface)
Object.freeze(InboundInterface.prototype)
/**
 * 
 */
export class OutboundInterface extends Interface {
    constructor(protocol, apply) {
        super(protocol)
        const propertyDescriptors = {}
        const { propertyTypes } = protocol
        for ( let name in propertyTypes )
        {
            let type = propertyTypes[name]
            let descriptor = {
                enumerable:true // Make property reflective
            }
            if ( type instanceof FunctionType )
                descriptor.value = (...args) => apply(name, args) // Non configurable and writable by default 
            else
                descriptor.get = () => apply(name) // property values in interfaces are read only, changing them requires invoking explicit methods   
            propertyDescriptors[name] = descriptor
        }
        Object.defineProperties(this, propertyDescriptors)
        Object.freeze(this)  // We freeze to make it non extensible so it follows the interface contract (the interface)
    }
}
Object.freeze(OutboundInterface)
Object.freeze(OutboundInterface.prototype)

export { Interface }
