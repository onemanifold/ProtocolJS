import { Connection } from "../src/Connection.js"

test("Connection Protocol", async () => {
    var connection1 = new Connection((message)=>connection2.receive(message))
    var connection2 = new Connection((message)=>connection1.receive(message))

    var send1, send2
    var message1Promise =  new Promise(send=>send1={send})
    var message2Promise =  new Promise(send=>send2={send})

    var [outbound1, outbound2] = await Promise.all([connection1.start(send1), connection2.start(send2)])
    
    expect(connection1.isActive()).toBe(true)
    expect(connection2.isActive()).toBe(true)

    outbound1.send("Hello world 1!")
    outbound2.send("Hello world 2!")

    var [message1, message2] = await Promise.all([message1Promise, message2Promise])

    expect(message1).toBe("Hello world 2!")
    expect(message2).toBe("Hello world 1!")

    connection1.end()

    expect(connection1.isActive()).toBe(false)
    expect(connection2.isActive()).toBe(false)

    try {
        await outbound1.send("Hello world!")
    } catch (e) {
        expect(e).toMatch('Connection is not active, interface is not operational')
    }
    //await expect((()=>outbound2.send())).rejects.toThrow()
})