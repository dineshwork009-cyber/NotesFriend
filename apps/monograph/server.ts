// This server file is used to serve the Remix app in production using Bun.
// run it like so: npm run build; cd output; bun install; bun run start
// Running it directly will give an error.
import type { ServerBuild } from "@remix-run/server-runtime";
import { createRequestHandler } from "@remix-run/server-runtime";
import { resolve } from "node:path";
// @ts-expect-error server is not built yet
import * as build from "./build/server/index";
import { type Serve } from "bun";

const remix = createRequestHandler(
  build as unknown as ServerBuild,
  Bun.env.NODE_ENV
);

export default {
  port: process.env.PORT || "3000",
  hostname: process.env.HOST || "localhost",
  async fetch(request) {
    // First we need to send handle static files
    const { pathname } = new URL(request.url);
    const file = Bun.file(
      resolve(__dirname, "./build/client/", `.${pathname}`)
    );
    if (await file.exists()) return new Response(file);
    // Only if a file doesn't exists we send the request to the Remix request handler
    return remix(request);
  }
} satisfies Serve;
