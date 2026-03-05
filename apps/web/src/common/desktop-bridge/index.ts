import { createWriteStream } from "../../utils/stream-saver";
import { type desktop as bridge } from "./index.desktop";

export const desktop: typeof bridge | undefined = undefined;
export function createWritableStream(filename: string) {
  return createWriteStream(filename);
}
