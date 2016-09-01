import * as fs from "fs";

/**
 * Up to caller to ensure that logFile exists
 */
export function log(logFile: string, data: any, transactionId?: number, date?: Date) {
    console.log(data);
    if (transactionId) {
        data = "[" + transactionId + "]: " + data;
    }
    if (date) {
        data = "[" + date.toLocaleString() + "." + date.getMilliseconds() + "]" + data;
    }
    data += "\n"

    fs.appendFile(logFile, data, (err) => {
        if (err) {
            console.log(err);
        }
    });
}
