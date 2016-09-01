import * as http from "http";

export interface IRequestHandler {
    handle(req: http.IncomingMessage, resp: http.ServerResponse): void;
}
