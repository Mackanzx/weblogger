import * as http from "http";

export interface RequestHandler {
    handle(req: http.IncomingMessage, resp: http.ServerResponse) : void;
}
