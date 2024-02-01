import { Interface } from "../src/Interface.js"
import { Protocol } from "../src/Protocol.js"

const pingProtocol = new Protocol({
    name:"ping",
    transitions:{
        pinging:{
            ping:"pinging",
            stop:"completed"
        },
    },
    starts:'pinging',
    ends:'completed'
})


