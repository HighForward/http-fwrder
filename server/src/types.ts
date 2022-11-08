import { IncomingHttpHeaders } from "http";

export interface IHost
{
    port: number,
    host: string
}

export interface IHttpReq {
    headers?: IncomingHttpHeaders
    method?: string
    url?: string
    body?: string
}

export interface IHttpRes {
    headers: Object
    body: string
}