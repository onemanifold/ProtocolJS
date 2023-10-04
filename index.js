import { Protocol } from "./src/Protocol.js"

export { Protocol }



class DuplexStream { // binary encoding/decoding (detects stream capacities)
    constructor() {
        this.protocol = new Protocol({
            send:method({"...message":any}),
            [Symbol.asyncIterator]:method()
        })
    }

    connect(writeStream, readStream) {
        this.protocol.interface((name, [message])=>{
            if (name === 'send')
            {
                writeStream.write()
            }
            else if ( name === Symbol.asyncIterator ) 
            {

            }
        })
    }
}




class RPCProtocol extends Protocol {
    constructor() {
        const requestId = number(1)
        const objectId  = number(2)
        const methodId  = number(1)
        super({
            request: method({requestId, objectId, methodId, '...params':any}, nil),
            response: method({requestId, '...params':any}, nil),
            error: method({requestId, error})
        })
    }
}



class RPC {
    requests = {}
    objects = []
    constructor(connection) {
        const rpcProtocol = new RPCProtocol()
        const rpcInterface = rpcProtocol.interface((propertyName, args)=> {
            // sending messages to the remote side
            var propertyIndex = rpcProtocol.names.indexOf(propertyName)
            connection.send(propertyIndex, ...args)

        })
        for await (let [propertyIndex, ...args] of connection ) {
            var propertyName =  rpcProtocol.names[propertyIndex]
            rpcProtocol.evaluate(this, propertyName, args)
        }
    }

    request(requestId, objectId, methodName, params ) {
        objects[objectId][methodName](...params)

    }
    response(requestId, {objectId, returnValue}) {

    }
    error()
}


class RemoteObjectProtocol extends Protocol {
    exports
    imports
    constructor() {
        super()
        
    }
}
class RemoteObjectConnection { // or SharedReferenceSpace / ReferenceSpace Connection / RemoteReferenceSpace
    remoteProtocol
    localProtocol
    imports
    exports
    constructor() {
        var connection = new Connection()
        this.rpc = new RPC(connection)
        var remoteProtocol = new Protocol({a:1,b:c})

        this.rpc.request()
    }
}



const remoteObjectProtocol = new Protocol({
    start:asyncmethod({object}, object),
    end:asyncmethod()
})

const sendMessage = ()=>{}
const connection = remoteObjectProtocol.interface(sendMessage)


// We want to be able to define the shape of the object we receive, and make that a specific protocol, different from the usual protocol, but how?
// Also although we separate the implementation from the protocol definition, how do we do this elegantly? perhaps a protocol can only be instantiated with a local implementation?
// A protocol also has usually two endpoints, and we can assume at the base it could be considered simetric, how can this work?
// The "instance" (or connection) is what we want to use for the communication to occur, but rather than "extending", we simply want to pass it as a variable so it can be used.
// How do we make the following happen? where the shape of the local object can be verified. (i.e. it must be a ledger)
const localLedger = {}
const remoteLedger = connection.start(localObject)
class RemoteLedgerProtocol extends RemoteObjectProtocol {
    constructor() {
        super()
    }
}

// The output for evaluation:
// valid expression
// [request[index], requestId, [objectId, params[]]]
// [response[index], requestID, response]

class Connection {
    serialize = (value) => value
    deserialize = (value) => value
}









// class SendReceiveInterface extends ObjectInterface {
//     constructor() {
//         super({
//             send:method(array),
//             receive:method(array)
//         })
//     }
// }


// class ConnectionProtocol extends Protocol {
//     constructor() {
//         super({
//             sendMessage:method({'...message':any})
//         })
//     }
// }