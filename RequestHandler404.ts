import * as http from "http";
import {IRequestHandler} from "./IRequestHandler"
import * as fs from "fs-extra";
import {log} from "./Logger";


function getLogFolder(date: Date): string {
    return "./logs/" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "/";
}

function getLogFile(date: Date): string {
    let h = "" + date.getHours();
    if (h.length == 1) {
        h = "0" + h;
    }
    return h + "H.log"
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

        const logReq = (data) => log(logFile, data, transactionId, new Date());
        logReq("URL-PATH: " + req.url);
        logReq("METHOD: " + req.method);
        logReq("HEADERS: " + JSON.stringify(req.headers, null, 3));

        req.on('data', (chunk) => {
            data += chunk;
        });

        const handleEndOfRequest = () => {
            if (data)
                logReq("DATA: " + data);
            resp.statusCode = 404;
            resp.end();
        };

        req.on('close', handleEndOfRequest);
        req.on('end', handleEndOfRequest);
    }
}
