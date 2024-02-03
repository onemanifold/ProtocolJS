import { Interface } from "./Interface.js"
import { Type } from "./Types/Type.js"
/**
 * @class Protocol
 * Represents a protocol as a hierarchical state machine.
 * 
 * A Protocol instance describes the entire lifecycle of a protocol, managing
 * its phases, transitions, and associated messages. It enables the creation of
 * complex, composable protocol definitions that can be interpreted and utilized
 * by an Interface.
 *
 * - Protocol Phases: Named states within the protocol.
 * - Protocol Steps: Transitions between phases triggered by protocol messages.
 * - Protocol Messages: Messages that drive phase transitions, optionally carrying
 *   typed values for validation.
 *
 * This class also provides methods for protocol verification, ensuring the integrity
 * and consistency of the defined protocol.
 */
export class Protocol {
    #completed = false

   /**
     * Constructs a new Protocol instance.
     * 
     * @param {Object} config - Configuration object for the protocol.
     * @param {string} config.name - The name of the protocol.
     * @param {Object} config.messagesTypes - Mapping of message names to their types.
     * @param {Object} config.transitions - Phase transitions defined as a map of message names to next phase names.
     * @param {string} config.starts - The name of the starting phase.
     * @param {string} config.ends - The name of the ending phase.
     */
    constructor({
        name,
        messagesTypes = {},
        transitions:phaseTransitions = {},
        starts:startPhaseName,
        ends:endPhaseName,
    }) {

        this.name = name
        this.startPhaseName = startPhaseName
        this.endPhaseName = endPhaseName

        this.phases = {}
        this.messages = {}

        this.setPhase(startPhaseName)
        this.setPhase(endPhaseName)

        for (let phaseName in phaseTransitions) {
            this.setPhase(phaseName)

            // Add transitions for phase
            for (let messageName in phaseTransitions[phaseName] ) {
                this.setTransition(phaseName, messageName, phaseTransitions[phaseName][messageName])
            }
        }

        // Add message types
        for (let messageName in messagesTypes) {

            this.setMessage(messageName, messagesTypes[messageName])
        }

        // Verify protocol is valid
        this.verify()
    }

    /**
     * Sets a new phase in the protocol.
     * 
     * @param {string} phaseName - The name of the phase to be set.
     */
    setPhase(phaseName) {
        if ( this.phases[phaseName] ) return
        this.phases[phaseName] = {
            name:phaseName, 
            transitions:{}, 
        }
    }

    /**
     * Retrieves the names of all phases in the protocol.
     * 
     * @return {string[]} An array of phase names.
     */
    getPhaseNames() {
        return Object.keys(this.phases)
    }

    /**
     * Retrieves the names of all messages associated with a given phase.
     * 
     * @param {string} phaseName - The name of the phase.
     * @return {string[]} An array of message names associated with the phase.
     */
    getPhaseMessageNames(phaseName) {
        return Object.keys(this.phases[phaseName].transitions)
    }

    /**
     * Removes a phase from the protocol.
     * 
     * @param {string} phaseName - The name of the phase to be removed.
     */ 
    removePhase(phaseName) {
        delete this.phases[phaseName]
    }

    /**
     * Sets a transition from one phase to another upon receiving a specific message.
     * 
     * @param {string} phaseName - The current phase name.
     * @param {string} messageName - The name of the message triggering the transition.
     * @param {string} nextPhaseName - The name of the next phase.
     * @throws {Error} Throws an error if the current phase or message does not exist.
     */
    setTransition(phaseName, messageName, nextPhaseName) {
        console.log("Adding transition", phaseName, messageName, nextPhaseName)
        if (!this.phases[phaseName]) {
            throw Error(`Phase ${phaseName} does not exist`)
        }
        else if (!this.messages[messageName]) this.setMessage(messageName)

        this.phases[phaseName].transitions[messageName] = nextPhaseName
    }

    /**
     * Removes a transition on a specific message from a phase.
     * 
     * @param {string} phaseName - The name of the phase.
     * @param {string} messageName - The name of the message.
     * @throws {Error} Throws an error if the phase or the transition on the message does not exist.
     */
    removeTransition(phaseName, messageName) {
        if (!this.phases[phaseName]) {
            throw Error(`Phase ${phaseName} has no transitions`)
        }
        if (!this.phases[phaseName].transitions[messageName]) {
            throw Error(`Transition on ${messageName} does not exist in ${phaseName}`)
        }
        
        delete this.phases[phaseName].transitions[messageName]
    }

    /**
     * Sets a message type in the protocol.
     * @param {*} name - The name of the message.
     * @param {Type} [type=null] - The type of the message.
     */
    setMessage(name, type = null) {
        if ( !type instanceof Type ) {
            throw Error(`Type ${type} is not a valid type`)
        }
        this.messages[name] = {name,type}
    }

    /**
     * Removes a message type to the protocol.
     * 
     * @param {string} name - The name of the message.
     * @throws {Error} Throws an error if the type is not a valid instance of Type.
     */
    removeMessage(name) {
        if (!this.messages[name]) {
            throw Error(`${name} message does not exist`)
        }
        
        delete this.messages[name]
    }


    /**
     * Verify the protocol is valid.
     *
     * Performs depth-first search to validate:
     * - All phases are reachable from the start phase
     * - The end phase is reachable from the start phase  
     * - No transitions exist on the end phase
     * - All referenced phases, messages, protocols exist
     * - No transitionless phases other than end phase
     * 
     * @throws {Error} Throws an error if the protocol is invalid.
     */ 
    verify() {

        const endPhase = this.phases[this.endPhaseName]
        const startPhase = this.phases[this.startPhaseName]

        // Track visited phases
        const visitedPhaseNames = new Set()

        // Track seen messages
        const seenMessages = new Set()
        
        // Stack for depth first search
        const stack = [this.startPhaseName]

        // Depth-first search 
        while (stack.length > 0) {
          
            // Get current phase  
            let currentPhaseName = stack.pop()
            let currentPhase = this.phases[currentPhaseName]

            // Make sure phase is not terminating unless it is the end phase
            if (!currentPhase) {
    
                if (currentPhase !== endPhase) {
                    throw Error(`Protocol ${this.name} has an invalid terminating phase: ${current}`)
                }
            }

            // Verify recursively if it has a protocol
            if ( currentPhase.protocol ) {
                currentPhase.protocol.verify()
            }

            // Mark as visited
            visitedPhaseNames.add(currentPhaseName)

            // Add next phases to stack and keep track of seen messages
            for (let messageName in currentPhase.transitions ) {
                var nextPhaseName = currentPhase.transitions[messageName]
                // if we have already visited that phase, skip it
                if (visitedPhaseNames.has(nextPhaseName)) {
                    continue
                } else {
                    stack.push(nextPhaseName)
                    // keep track of seen messages
                    if (!seenMessages.has(messageName)) {
                        
                        seenMessages.add(messageName)
                    }
                }
            }

            return this
        }


        // Validate there are no orphan messages 
        for (let messageName in this.messages) {
            if (!seenMessages.has(messageName)) {
                throw Error(`Protocol ${this.name} has orphan message: ${messageName}`)
            }
        }
        

        // Validate all phases are reachable
        for (let phaseName in this.phases) {
            if (!visitedPhaseNames.has(phaseName)) {
                throw Error(`Protocol ${this.name} has an unreachable phase: ${phaseName}`)
            }
        }

        // Validate end phase is reachable
        if (!visitedPhaseNames.has(this.endPhaseName)) {
            throw Error(`Protocol ${this.name} end phase is not reachable: ${this.endPhaseName}`)
        }

        // Validate no transitions on end phase
        if (Object.keys(endPhase.transitions).length > 0) {
            throw Error(`Protocol ${this.name} end phase has transitions`)
        }

        // Validate messages exist
        for (let phaseName in this.phases) {
            for (let messageName in this.phases[phaseName].transitions) {

                if (!this.messages[messageName]) {
                    throw Error(`Protocol ${this.name} has and invalid message: ${messageName}`)
                }
            }
        }

        // Validate all names are unique across phases, messages and protocols.
        for (let messageName in this.messages) {
            if (this.phases[messageName]) {
                throw Error(`Protocol ${this.name} has an message named the same as a phase: ${messageName}. Utilize distinct names for phases, messages, and protocols.`)
            }
        }
        
    }

    /**
     * Determines if a transition can occur based on the current phase, message, and arguments.
     * 
     * @param {string} phaseName - The name of the current phase.
     * @param {string} messageName - The name of the message.
     * @param {any[]} args - Arguments to be passed to the message type validator.
     * @return {boolean} True if the transition is valid, false otherwise.
     */
    can(phaseName, messageName, args) {
        // Check if the phase exists and has a transition for the message
        const phase = this.phases[phaseName]
        if (!phase || !phase.transitions[messageName]) {
            //console.log(">>>>", phase, phase.transitions[messageName])
            return true;
        }

        // If the message has a corresponding type, verify the arguments
        if (this.messages[messageName] && this.messages[messageName].type) {
            //console.log("----->", phaseName, messageName,  this.messages[messageName].type)
            const messageType = this.messages[messageName].type
            if (!messageType.validate(args)) {
                return false
            }
        }

        // If all conditions pass, return true
        return true
    }

    /**
     * Retrieves the messages associated with transitions from a specific phase.
     * 
     * @param {string} phaseName - The name of the phase.
     * @return {string[]} An array of message names.
     */
    phaseMessages(phaseName) {
        return Object.keys(this.phases[phaseName].transitions)
    }

    /**
     * Checks if the protocol has a specific message.
     * 
     * @param {string} messageName - The name of the message.
     * @return {boolean} True if the message exists in the protocol, false otherwise.
     */
    hasMessage(messageName) {
        return this.messages[messageName] ? true : false
    }

    /**
     * lists all the phases in the protocol.
     * 
     * @return {string[]} An array of phase names.
     */
    get phaseNames() {
        return Object.keys(this.phases)
    }

    /**
     * lists all the messages in the protocol.
     * 
     * @return {string[]} An array of message names.
     */
    get messageNames() {
        return Object.keys(this.messages)
    }

    /**
     * Marks the protocol as complete.
     * 
     * @return {Protocol} The protocol instance.
     * @throws {Error} Throws an error if the protocol is not valid.
     */
    complete() {
        if ( this.#completed ) return this
        this.verify()
        if ( !Object.isFrozen(this) ) {
            Object.freeze(this) // makes sure that the protocol is immutable
        }
        this.#completed = true
        return this
    }

    /**
     * Creates an interface for the protocol.
     * Notice must be complete before calling this method.
     * 
     * @param {Model} model - The model to which the protocol will be applied.
     */
    interface(model) {
        // verify protocol is complete
        if (!this.#completed) {
            throw Error(`Protocol ${this.name} is not complete`)
        }
        // create interface
        var protocolInterface = new Interface(this, model)
    }
}

export const protocol = (name, definition) => new Protocol(name, definition).verify()