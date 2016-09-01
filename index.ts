import * as http from "http";
import * as fs from "fs";
import {log, createMissingFolders} from "./Util";
import {RequestHandler404} from "./RequestHandler404";
import {RequestHandlerAdmin} from "./RequestHandlerAdmin"

// main
const handler404 = new RequestHandler404();
const handlerAdmin = new RequestHandlerAdmin();

const server404 = http.createServer(handler404.handle);
const serverAdmin = http.createServer(handlerAdmin.handle);

server404.listen(80);
serverAdmin.listen(8080);
