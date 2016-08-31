import * as http from "http";
import * as https from "https";
import * as fs from "fs";

function log(logFile: string, transactionId: number, data: any) {
    console.log(data);
    data = "Request [" + transactionId + "]: " + data + "\n";
    fs.appendFile(logFile, data, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function createMissingFolders(folders: string[]) {
    folders.forEach((folder) => {
        if (!fs.existsSync(folder)) {
            fs.mkdir(folder, (err) => {
                console.log(err);
            });
        }
    });
}

function handleNastyRequest(req: http.IncomingMessage, resp: http.ServerResponse) {
    let data = "";
    let transactionId = Math.random();
    let now = new Date();

    let folder1 = "logs/";
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

http.createServer(handleNastyRequest).listen(80);

function handleAdminRequest(req: http.IncomingMessage, resp: http.ServerResponse) {
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

http.createServer(handleAdminRequest).listen(8080);
