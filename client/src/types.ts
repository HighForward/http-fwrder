import { IncomingHttpHeaders } from "http";

export interface IHttpReq {
    headers: Headers
    method: string
    url: string
    body?: string
}

export interface IHttpRes {
    headers?: Record<string, string>
    body: string
}