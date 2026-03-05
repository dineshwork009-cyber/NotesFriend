import "isomorphic-fetch";
import dotenv from "dotenv";
import { DOMParser } from "linkedom";
import WebSocket from "ws";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.DOMParser = DOMParser;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.WebSocket = WebSocket;
require("abortcontroller-polyfill/dist/polyfill-patch-fetch");
dotenv.config();
