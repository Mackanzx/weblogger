import * as http from "http";
import * as fs from "fs";
import * as rh from "./RequestHandler"

export class RequestHandlerAdmin implements rh.RequestHandler {
    constructor() {
        console.log("RequestHandlerAdmin Created.");
    }
    handle(req: http.IncomingMessage, resp: http.ServerResponse): void {
        // TODO: Save real IP of blocked sites to be able to enable proxying to them through an admin request?
        let requestHandled = false;
        if (!req.url || req.url === "/") {
            let logDays = fs.readdirSync("./logs/");
            resp.write("<html><body>");
            logDays.forEach((s) => resp.write("<a href=\"" + s + "\">" + s + "</a><br>"));
            resp.end("</body></html>");
            requestHandled = true;
        } else {
            let reqFolder = "./logs/" + req.url;
            if (fs.existsSync(reqFolder)) {
                let logFiles = fs.readdirSync(reqFolder);
                if (logFiles.length) {
                    let str = "";
                    logFiles.forEach((s) => str += "--[" + s + "]--\n" + fs.readFileSync(reqFolder + "/" + s, "utf8") + "\n");
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
