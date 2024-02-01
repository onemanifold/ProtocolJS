import { Protocol } from "../src/Protocol.js"

describe("Protocol", () => {
    let protocol;

    beforeEach(() => {
        protocol = new Protocol({
            name: "Test Protocol",
            type: "Test Type",
            messagesTypes: {
                message1: "Type1",
                message2: "Type2",
            },
            transitions: {
                phase1: "phase2",
                phase2: "phase3",
            },
            starts: "phase1",
            ends: "phase3",
        });
    });

    it("should set a new phase in the protocol", () => {
        protocol.setPhase("phase4");
        expect(protocol.getPhaseNames()).toContain("phase4");
    });

    it("should retrieve the names of all phases in the protocol", () => {
        const phaseNames = protocol.getPhaseNames();
        expect(phaseNames).toEqual(["phase1", "phase2", "phase3"]);
    });

    it("should retrieve the names of all messages associated with a given phase", () => {
        const messageNames = protocol.getPhaseMessageNames("phase1");
        expect(messageNames).toEqual(["message1"]);
    });

    it("should remove a phase from the protocol", () => {
        protocol.removePhase("phase1");
        expect(protocol.getPhaseNames()).not.toContain("phase1");
    });

    it("should set a transition from one phase to another", () => {
        protocol.setTransition("phase1", "message1", "phase2");
        expect(protocol.can("phase1", "message1", [])).toBe(true);
    });

    it("should remove a transition on a specific message from a phase", () => {
        protocol.removeTransition("phase1", "message1");
        expect(protocol.can("phase1", "message1", [])).toBe(false);
    });

    it("should set a message type in the protocol", () => {
        protocol.setMessage("message3", "Type3");
        expect(protocol.hasMessage("message3")).toBe(true);
    });

    it("should remove a message type from the protocol", () => {
        protocol.removeMessage("message1");
        expect(protocol.hasMessage("message1")).toBe(false);
    });

    it("should verify the protocol is valid", () => {
        expect(() => protocol.verify()).not.toThrow();
    });

    it("should determine if a transition can occur", () => {
        expect(protocol.can("phase1", "message1", [])).toBe(true);
        expect(protocol.can("phase1", "message2", [])).toBe(false);
    });

    it("should retrieve the messages associated with transitions from a specific phase", () => {
        const messages = protocol.phaseMessages("phase1");
        expect(messages).toEqual(["message1"]);
    });

    it("should list all the phases in the protocol", () => {
        const phaseNames = protocol.phaseNames;
        expect(phaseNames).toEqual(["phase1", "phase2", "phase3"]);
    });

    it("should list all the messages in the protocol", () => {
        const messageNames = protocol.messageNames;
        expect(messageNames).toEqual(["message1", "message2"]);
    });

    it("should mark the protocol as complete", () => {
        expect(() => protocol.complete()).not.toThrow();
        expect(protocol.isCompleted()).toBe(true);
    });

    it("should create an interface for the protocol", () => {
        const model = "Test Model";
        expect(() => protocol.interface(model)).not.toThrow();
    });
});
