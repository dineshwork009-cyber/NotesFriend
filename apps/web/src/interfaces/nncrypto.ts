import { INNCrypto } from "@notesfriend/crypto";
import CryptoWorker from "./nncrypto.worker?worker";
import { wrap } from "comlink";
import { NNCrypto as NNCryptoSync } from "@notesfriend/crypto";
import { isTransferableStreamsSupported } from "../utils/feature-check";

export const NNCrypto = isTransferableStreamsSupported()
  ? (wrap<INNCrypto>(new CryptoWorker()) as INNCrypto)
  : new NNCryptoSync();
// TODO: disable until we fix the `pull failed` errors for good.
// IS_DESKTOP_APP && window.NativeNNCrypto
//   ? new window.NativeNNCrypto()
//   : (wrap<INNCrypto>(new CryptoWorker()) as INNCrypto);
