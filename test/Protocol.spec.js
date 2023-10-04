import { boolean, method, Protocol } from "../src/Protocol.js"
    
test("Protocol verification", async () => {
    const protocol = new Protocol({
            ping:method([], boolean),
            active:boolean
    })
    var a = await new Promise((resolve)=> {
        var test = {
            ping:resolve,
            active:false
        }
        protocol.verify(test)
        test.ping(true)
    })
    expect(a).toBe(true)
})