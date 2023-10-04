import { OutboundInterface, InboundInterface } from "../src/Interface.js"
import { boolean, method, Protocol } from "../src/Protocol.js"

// TODO: test for passing arguments and complex method signatures
test("should verify outbound Interface", async () => {
    const protocol = new Protocol({
        ping:method([],boolean),
        active:boolean
    })
    var pingInterface = new OutboundInterface(protocol, (name, args) => {
        if (name === "ping" && args.length === 0 )
            return true
        else (name === "active" )
            return false
    })
    var a = pingInterface.ping()
    expect(a).toBe(true)
    var b = pingInterface.active
    expect(b).toBe(false)
})

test("should verify inbound Interface", async () => {
    const protocol = new Protocol({
        ping:method([],boolean),
        active:boolean
    })
    var ping = await new Promise((resolve)=>{
        var pingInterface = new InboundInterface(protocol, { 
            ping:()=>resolve(true),
            active:false
        })
        setTimeout(()=>pingInterface.apply("ping"))
        expect(pingInterface.apply("active")).toBe(false)
    })
    expect(ping).toBe(true)
    
})

