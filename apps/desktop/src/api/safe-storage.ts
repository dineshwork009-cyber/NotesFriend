import { safeStorage } from "electron";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const safeStorageRouter = t.router({
  isEncryptionAvailable: t.procedure.query(() => {
    return (
      !process.env.PORTABLE_EXECUTABLE_DIR &&
      safeStorage.isEncryptionAvailable()
    );
  }),
  /**
   * Takes a string and returns an encrypted base64 string
   */
  encryptString: t.procedure.input(z.string()).query(({ input }) => {
    return safeStorage.encryptString(input).toString("base64");
  }),
  /**
   * Takes an encrypted base64 string and returns a string
   */
  decryptString: t.procedure.input(z.string()).query(({ input }) => {
    return safeStorage.decryptString(Buffer.from(input, "base64"));
  })
});
