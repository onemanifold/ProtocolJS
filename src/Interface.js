import { Protocol } from "./Protocol.js";
import { Model } from "./Model.js";

/**
 * The Interface class enforces a specific Protocol on a Model. This class ensures that interactions
 * between different components adhere to the defined protocol, managing phase transitions and validating
 * messages based on the protocol's rules. It acts as a mediator between the Model and its external interactions,
 * ensuring that the Model's state changes follow the prescribed sequence of phases and events in the Protocol.
 */
export class Interface {
    // Private fields for storing instances of Protocol, Model, and current phase name
    #protocol;
    #model;
    #currentPhaseName;

    /**
     * Constructs an Interface instance, initializing the protocol, model, and current phase.
     * This constructor validates that the provided protocol and model are appropriate instances
     * and throws an error if they are not. It also sets up the interface methods based on the
     * events defined in the protocol.
     * 
     * @param {Protocol} protocol - The Protocol instance to be enforced.
     * @param {Model} model - The Model instance that will interact through this interface.
     * @throws {Error} - Throws an error if either the protocol or model is not of the expected instance type.
     */
    constructor(protocol, model) {
        if (!(protocol instanceof Protocol)) throw new Error("Interface: Invalid protocol instance");
        if (!(model instanceof Model)) throw new Error("Interface: Invalid model instance");

        this.#protocol = protocol.verify();
        this.#model = model.start(protocol);
        this.#currentPhaseName = protocol.startPhaseName;
        this.#buildInterface();
        Object.freeze(this);
    }

    /**
     * Provides access to the current protocol instance.
     * 
     * @returns {Protocol} - The currently enforced protocol.
     */
    get protocol() {
        return this.#protocol;
    }

    /**
     * Private method for dynamically creating interface methods based on the events defined in the protocol.
     * Each method created delegates to the corresponding method in the model and handles phase transitions
     * according to the protocol's definition.
     *
     * @private
     * @throws {Error} - Throws an error if the model does not implement a method required by the protocol.
     */
    #buildInterface() {
        for (let eventName of Object.keys(this.#protocol.events)) {
            if (!this.#model[eventName] || typeof this.#model[eventName] !== 'function') {
                throw new Error(`Model does not implement the protocol message: ${eventName}`);
            } else {
                this[eventName] = async (...args) => await this.#transition(eventName, ...args);
            }
        }
    }

    /**
     * Private method to check if the interface's current phase matches a given phase.
     * 
     * @private
     * @param {string} phaseName - The phase name to check against the current phase.
     * @returns {boolean} - Returns true if the current phase matches the given name; otherwise, false.
     */
    #is(phaseName) {
        return this.#currentPhaseName === phaseName;
    }

    /**
     * Handles the transition to the next phase based on the current event. It checks if the transition
     * is valid per the protocol and, if so, performs the transition by updating the current phase.
     * This method also calls the corresponding event handler in the model with provided arguments.
     *
     * @private
     * @param {string} eventName - The name of the event triggering the transition.
     * @param {Array} args - Arguments to be passed to the model's event handler.
     * @returns {Promise<boolean>} - Returns true if the transition was successful; otherwise, false.
     * @throws {Error} - Throws an error if the transition is not allowed in the current phase.
     */
    async #transition(eventName, args = []) {
        if (this.#protocol.can(this.#currentPhaseName, eventName, args)) {
            try {
                await this.#model[eventName](...args);
            } catch (e) {
                console.error(e);
                return false;
            }
            const currentPhase = this.#protocol.phases[this.#currentPhaseName];
            const nextPhase = currentPhase.transitions[eventName];
            this.#currentPhaseName = nextPhase;
            return true;
        } else {
            throw new Error(`Transition "${eventName}" not allowed in phase "${this.#currentPhaseName}".`);
        }
    }
}