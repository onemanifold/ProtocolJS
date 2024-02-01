import { Protocol } from './Protocol.js';
import { Interface } from './Interface.js';

/*
* The model is the base class utilized to implement a protocol.
* It is a simple class with methods that can be called by the interface.
* The model is responsible for implementing the protocol's events and transitions.
* It is also responsible for managing the state.
*/
export class Model {
    #protocol;
    #interface;
    /**
     * Constructs a Model instance.
     * @param {object} model - The model instance to interact with.
     */
    constructor(protocol, messageMethods) {
        if (protocol) this.start(protocol, messageMethods)
    }

    /**
     * Initializes the model.
     */
    start(protocol, protocolInterface) {
        if (!(protocol instanceof Protocol)) throw new Error("Model: Invalid protocol instance");
        if (!(protocolInterface instanceof Interface)) throw new Error("Model: Invalid interface instance");
        this.#protocol = protocol;
        this.#interface = protocolInterface;

        console.log('Model started')
        return this
    }

    /**
     * Stops the model.
     */
    stop() {
        console.log('Model stopped')

    }
}