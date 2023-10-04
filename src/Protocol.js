import { Type, nil, boolean, int8, int16, int32, number, array, string, object, method, option, tuple, lambda } from "./Type.js"

/**
 * 
 */
export class Protocol extends Type {
    propertyTypes = {}
    constructor(propertyTypes) {
        super('object')
        if ( propertyTypes )
            this.setPropertyTypes(propertyTypes)
    }
    get protocolName() {
        return this.constructor.name
    }
    // Making object reflective
    get protocolKeys() {
        return Object.keys(this.propertyTypes)
    }

    /**
     * 
     * @param {*} propertyTypes
     * @returns 
     */
    setPropertyTypes(propertyTypes) {
        for (let name in propertyTypes )                                      // For every property Interface name
        {
            let propertyType = this.getType(propertyTypes[name])              // retrieve property Interface corresponding to that name,
            this.propertyTypes[name] = propertyType                           // and store it internally
            Object.freeze(propertyType)
        }
        Object.freeze(this)
        return this                                                           // return interface object to enable method chaining
    }

    /**
     * 
     * @param {*} object 
     * @returns 
     */
    verify(object) {
        super.verify(object)
        for (let name in this.propertyTypes )                                 // For every property type
        {
            let propertyType = this.propertyTypes[name]
            propertyType.verify(object[name])  
        }
        return this  
    }

    /**
     * 
     * @param {*} object 
     * @returns 
     */
    wrap(object) {
        this.verify(object)
        const wrapInterface = this.interface()
        const apply = wrapInterface.inbound(object)
        return wrapInterface.outbound(apply)
    }
}

class ObjectProtocol extends Protocol {
    constructor(propertyTypes) {
        super()
        this.setPropertyTypes(propertyTypes)
    }
}

export const protocol = (...args) => {
    if ( args.length === 1 & args[0] instanceof Object )
        return new ObjectProtocol(args[0])
    else 
        return new Protocol(...args)
}
export const call = lambda
export { nil, boolean, int8, int16, int32, number, array, string, object, method, option, tuple, lambda }