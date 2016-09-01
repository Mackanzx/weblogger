import * as http from "http";
import {IRequestHandler} from "./IRequestHandler"
import * as fs from "fs-extra";
import {log} from "./Logger";


function getLogFolder(date: Date): string {
    return "./logs/" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "/";
}

function getLogFile(date: Date): string {
    return date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "." + date.getMilliseconds() + ".log"
}

export class RequestHandler404 implements IRequestHandler {
    constructor() {
        console.log("RequestHandler404 Created.");
    }

    handle(req: http.IncomingMessage, resp: http.ServerResponse): void {
        let data = "";
        const transactionId = Math.random();
        const now = new Date();
        const folder = getLogFolder(now);
        const logFile = folder + getLogFile(now);

        if (!fs.existsSync(folder)) {
            fs.mkdirsSync(folder);
        }

        log(logFile, transactionId, "URL-PATH: " + req.url);
        log(logFile, transactionId, "METHOD: " + req.method);
        log(logFile, transactionId, "HEADERS: " + JSON.stringify(req.headers, null, 3));

        req.on('data', (chunk) => {
            data += chunk;
        });

        const handleEndOfRequest = () => {
            if (data)
                log(logFile, transactionId, "DATA: " + data);
            resp.statusCode = 404;
            resp.end();
        };

        req.on('close', handleEndOfRequest);
        req.on('end', handleEndOfRequest);
    }
}
