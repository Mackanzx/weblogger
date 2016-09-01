import * as http from "http";
import * as fs from "fs";
import {log, createMissingFolders} from "./Util";
import {RequestHandler404} from "./RequestHandler404";
import {RequestHandlerAdmin} from "./RequestHandlerAdmin"

// main
let handler404 = new RequestHandler404();
let handlerAdmin = new RequestHandlerAdmin();

let server404 = http.createServer(handler404.handle);
let serverAdmin = http.createServer(handlerAdmin.handle);

server404.listen(80);
serverAdmin.listen(8080);
