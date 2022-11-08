import { Server, createServer, request } from "node:http";
import { IHost, IHttpReq, IHttpRes } from "./types";
import { IncomingMessage, ServerResponse } from "http";
import { EventEmitter } from 'node:events';
import { TunnelServer } from "./tcp_tunnel";

export class HttpServer extends EventEmitter {

    private _server: Server
    private _tunnel: TunnelServer
    private _host: IHost

    private _awaiting_response: ServerResponse[] = []

    constructor(host: IHost)
    {
        super()
        this._host = host
        this._server = createServer()
        this._tunnel = new TunnelServer({
            host: "localhost",
            port: 9999
        })

    }

    listen() {
        this._server.listen(this._host.port, this._host.host, () => {
            console.log(`HTTP Server listening on ${this._host.host}:${this._host.port}`)
        })
    }

    async handle_req() {
        await this._server.on('request', async (req: IncomingMessage, res: ServerResponse) => {

            const clientSocket = this._tunnel.getSocket()

            await this._tunnel.forwardRequest({
                method: req.method,
                url: req.url,
                headers: req.headers
            })

            this._awaiting_response.push(res)
        })
    }

    async handle_res() {
        this._tunnel.on("forwarded_response", (data: IHttpRes) => {
            const res = this._awaiting_response.find(Boolean);

            if (res) {

                // Object.entries(data.headers).forEach(([key, value]) => {
                //     res.setHeader(key, value)
                // })

                res.setHeader('content-type', 'application/json')
                // res.setHeader()
                res?.end(data.body);

                let index = this._awaiting_response.indexOf(res);
                if (index !== -1) {
                    this._awaiting_response.splice(index, 1);
                }
            }
        })
    }

}

