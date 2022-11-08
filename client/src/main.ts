import net from "node:net"
import { Socket } from "net";
import fetch from 'node-fetch'
import { IHttpReq, IHttpRes } from "./types";

const client: net.Socket = new net.Socket()
client.setKeepAlive()

client.connect({
    port: 9999,
    host: "localhost",

}, () => {
    console.log('connected to server!');
})

client.on("error", () => {
    console.log('error')
})

client.on('close', (item) => {
    console.log("connection closed")
})

client.on("data", async (res: any) => {
    const httpReq: IHttpReq = JSON.parse(res.toString())
    const init = {
        method: httpReq.method.toUpperCase(),
        headers: httpReq.headers
    }

    const response = await fetch('http://127.0.0.1' + ':8080' + httpReq.url, init)

    const content_type = response.headers.get('content-type')
    const headers: Headers = response.headers

    let data: string = ""

    if (content_type?.includes("application/json")) {
        const tmp = await response.json()
        data = JSON.stringify(tmp)
    } else {
        data = await response.text()
    }

    let  custom_headers: Record<string, string> = {}

    headers.forEach((value, key, parent) => {
            custom_headers[key] = value
    })

    const httpRes: IHttpRes = {
        headers: custom_headers,
        body: data
    }

    client.write(JSON.stringify(httpRes))
})