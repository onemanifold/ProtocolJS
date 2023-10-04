import { string } from "./Type.js"
import { protocol, call } from "./Protocol.js"
import { InboundInterface, OutboundInterface } from "./Interface.js"

/**
 * Map each object/method pair for every protocol exchanged in an 
 * If every interaction is really with a function, we can simply encode the "payload", and the other side should be able to decode the payload (we have enough information as to know the size of the payload)
 */
export class Connection {
    offer = new Connection.Offer()
    #active = false
    #inboundInterface
    #outboundInterface
    #send
    #receiveOffer
    /**
     * This can be called via super, to add encoding/decoding capacities
     */
    constructor(receive) {
        this.#send = receive
    }

    async start(object) {
        this.offer.local.verify(object)
        // Waiting for incoming offer
        const incomingOffer = await new Promise(async (resolve) => {
            this.#receiveOffer = resolve
            await Promise.resolve() // Waiting one tick to send connection offer (to avoid locking in local environment)
            this.#send(this.offer)
        })
        if ( this.offer.match(incomingOffer) ) {
            const reciprocalObject = this.#exchange(object)
            this.#active = true
            return reciprocalObject
        }
        else throw(`Protocol offer ${incomingOffer} does not match ${this.offer}`)
    }
    
    receive(message) {
        if ( message === null ) 
            return this.#end()
        else if (!this.#active ) {
            // First message should be protocol offer
            return this.#receiveOffer(message)
        } 
        else {
            return this.#forwardToInterface(message)
        } 
    }

    #forwardToInterface(message) {
        let {local} = this.offer
        let propertyNames = Object.keys(local.propertyTypes)
        let [ methodIndex, args ] = message
        let methodName = propertyNames[methodIndex]
        return this.#inboundInterface.apply(methodName, args)
    }

    #exchange(object) {
        let {local, remote} = this.offer
        // Binding Inbound interface, this will map incoming messages to our offer object
        this.#inboundInterface = new InboundInterface(local, object)
        // Building outbound interface, this will
        let propertyNames = Object.keys(remote.propertyTypes)
        const apply = async (methodName, args) => {
            if (!this.#active) {
                throw("Connection is not active, interface is not operational")
            } else {
                const methodIndex = propertyNames.indexOf(methodName)
                return await this.#send([methodIndex, args])
            }
        }
        this.#outboundInterface = new OutboundInterface(remote, apply)
        return this.#outboundInterface
    }

    #end() {
        if (!this.#active) return
        // send a null packet? and receive a null packet, so in a way this would be initial signaling
        this.#active = false
        this.#send(null)
    }
    isActive() {
        return this.#active
    }

    async end() {
        return await this.#send(null)
    }

    static Offer = class ConnectionOffer {
        constructor(remote = protocol({send:call({message:string})}), local = remote) {
            this.remote = remote
            this.local = local
        }
        // TODO: Make match function more granular
        match({local, remote}) {
           return ( JSON.stringify(this.remote) == JSON.stringify(local)
            && JSON.stringify(this.local) == JSON.stringify(remote) )
        }
    }
}