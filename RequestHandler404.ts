import * as http from "http";
import * as rh from "./RequestHandler"
import {log, createMissingFolders} from "./Util";

export class RequestHandler404 implements rh.RequestHandler {
    constructor() {
        console.log("RequestHandler404 Created.");
    }
    handle(req: http.IncomingMessage, resp: http.ServerResponse): void {
        let data = "";
        let transactionId = Math.random();
        let now = new Date();

        let folder1 = "./logs/";
        let folder2 = folder1 + now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "/";
        let logFile = folder2 + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + "." + now.getMilliseconds() + ".log";

        createMissingFolders([folder1, folder2]);

        log(logFile, transactionId, "URL-PATH: " + req.url);
        log(logFile, transactionId, "METHOD: " + req.method)
        log(logFile, transactionId, "HEADERS: " + JSON.stringify(req.headers, null, 3));

        req.on('data', (chunk) => {
            if (data === "") {
                data = "chunk: ";
            }
            data += chunk;
        });

        let handleEndOfRequest = () => {
            if (data)
                log(logFile, transactionId, data);
            resp.statusCode = 404;
            resp.end();
        }
        req.on('close', handleEndOfRequest);
        req.on('end', handleEndOfRequest);
    }
}
