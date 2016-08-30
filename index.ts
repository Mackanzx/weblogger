import * as http from "http";
import * as https from "https";
import * as fs from "fs";

function log(logFile: string, transactionId: number, data: any) {
    console.log(data);
    data = "TRANSID[" + transactionId + "]: " + data + "\n";
    fs.appendFile(logFile, data, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function handleEndOfRequest(logFile: string, transactionId: number, data: string) {
    if (data === "")
        data = "no data"
    log(logFile, transactionId, data);
}

function createMissingFolders(folder: string) {
    if (!fs.existsSync(folder)) {
        fs.mkdir(folder, (err) => {
            console.log(err);
        });
    }
}

function handle(req: http.IncomingMessage, resp: http.ServerResponse) {
    let data = "";
    let transactionId = Math.random();
    let now = new Date();

    let folder1 = "logs/";
    let folder2 = folder1 + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "/";
    let logFile = folder2 + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + "-" + now.getMilliseconds() + ".log";

    createMissingFolders(folder1);
    createMissingFolders(folder2);

    let log2 = (data2) => (log(logFile, transactionId, data2));

    log2("URL: " + req.url);
    log2("METHOD: " + req.method)
    log2(JSON.stringify(req.headers));

    req.on('data', (chunk) => {
        if (data === "") {
            data = "chunk: ";
        }
        data += chunk;
    });

    let handleIt = () => {
        handleEndOfRequest(logFile, transactionId, data);
        resp.statusCode = 404;
        resp.end();
    }
    req.on('close', handleIt);
    req.on('end', handleIt);
}

let httpsOptions : https.ServerOptions = {
    // TODO
}

http.createServer(handle).listen(80);
https.createServer(httpsOptions, handle).listen(443);