import { TunnelServer } from "./tcp_tunnel";
import { HttpServer } from "./http_server";
import { EventEmitter } from 'node:events';
import { IHttpReq } from "./types";

const httpServer: HttpServer = new HttpServer({
    host: "localhost",
    port: 80
})

httpServer.handle_req()
httpServer.handle_res()
httpServer.listen()