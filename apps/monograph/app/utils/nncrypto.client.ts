import { INNCrypto } from "@notesfriend/crypto";
import CryptoWorker from "./nncrypto.worker?worker";
import { wrap } from "comlink";

export const NNCrypto = wrap<INNCrypto>(new CryptoWorker()) as INNCrypto;
