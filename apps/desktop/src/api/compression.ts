import zlib from "node:zlib";
import utils from "node:util";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const gzipAsync = utils.promisify(zlib.gzip);
const gunzipAsync = utils.promisify(zlib.gunzip);

export const compressionRouter = t.router({
  gzip: t.procedure
    .input(z.object({ data: z.string(), level: z.number() }))
    .query(async ({ input }) => {
      const { data, level } = input;
      return (await gzipAsync(data, { level })).toString("base64");
    }),
  gunzip: t.procedure.input(z.string()).query(async ({ input }) => {
    return (await gunzipAsync(Buffer.from(input, "base64"))).toString("utf-8");
  })
});
