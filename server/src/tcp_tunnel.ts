import net, { Socket } from "node:net"
import { IHost, IHttpReq, IHttpRes } from "./types";
import { EventEmitter } from "node:events";

export class TunnelServer extends EventEmitter{

    private _tunnel_server: net.Server
    private sockets: Socket[] = []

    constructor(host: IHost) {

        super()
        this._tunnel_server = net.createServer((socket) => {

            this.sockets.push(socket)
            console.log(`A new Client Connected. total: ${this.sockets.length}`)

            socket.on('error', () => {
                this.removeClientSocket(socket)
            })

            socket.on('close', (data: any) => {
                this.removeClientSocket(socket)
            })

            socket.on('end', () => {
                this.removeClientSocket(socket)
            });

            socket.on('data', (data: string) => {
                const res: IHttpRes = JSON.parse(data.toString())
                this.emit("forwarded_response", res)
            })
        })

        this._tunnel_server.listen(host.port, () => {
            console.log(`TCP Tunnel Built on port ${host.port}`)
        })

    }

    removeClientSocket(socket: Socket) {
        let index = this.sockets.indexOf(socket);
        if (index !== -1) {
            this.sockets.splice(index, 1);
            console.log(`Client Disconnected, index ${index}`);
        }
    }

    async forwardRequest(req: IHttpReq) {
        const target_socket = this.sockets.find(Boolean)
        target_socket?.write(JSON.stringify(req))
    }

    getSocket() {
        return this.sockets.find(Boolean)
    }

}

