import * as fs from "fs";

export function log(logFile: string, transactionId: number, data: any) {
    console.log(data);
    data = "Request [" + transactionId + "]: " + data + "\n";
    fs.appendFile(logFile, data, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

export function createMissingFolders(folders: string[]) {
    folders.forEach((folder) => {
        if (!fs.existsSync(folder)) {
            fs.mkdir(folder, (err) => {
                console.log(err);
            });
        }
    });
}
