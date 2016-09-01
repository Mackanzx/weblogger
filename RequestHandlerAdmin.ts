import * as http from "http";
import * as fs from "fs";
import {IRequestHandler} from "./IRequestHandler"

function getLinkTo(str: string) {
    return "<a href=\"" + str + "\">" + str + "</a><br>";
}

function getLogEntryFor(folder: string, str: string) {
    return "--[" + str + "]--\n" + fs.readFileSync(folder + "/" + str, "utf8") + "\n";
}

export class RequestHandlerAdmin implements IRequestHandler {
    constructor() {
        console.log("RequestHandlerAdmin Created.");
    }
    handle(req: http.IncomingMessage, resp: http.ServerResponse): void {
        // TODO: Save real IP of blocked sites to be able to enable proxying to them through an admin request?
        let requestHandled = false;
        if (!req.url || req.url === "/") {
            const logDays = fs.readdirSync("./logs/");
            resp.write("<html><body>");
            logDays.forEach((s) => resp.write(getLinkTo(s)));
            resp.end("</body></html>");
            requestHandled = true;
        } else {
            let reqFolder = "./logs/" + req.url;
            if (fs.existsSync(reqFolder)) {
                const logFiles = fs.readdirSync(reqFolder);
                if (logFiles.length) {
                    let str = "";
                    logFiles.forEach((s) => str += getLogEntryFor(reqFolder, s));
                    resp.end(str);
                    requestHandled = true;
                }
            }
        }
        if (!requestHandled) {
            resp.statusCode = 404;
            resp.end();
        }
    }
}
