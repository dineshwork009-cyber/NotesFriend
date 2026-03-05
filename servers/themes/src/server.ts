import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { ThemesAPI } from "./api";
import { syncThemes } from "./sync";
import cors from "cors";

const server = createHTTPServer({
  middleware: cors(),
  router: ThemesAPI
});
const PORT = parseInt(process.env.PORT || "9000");
const HOST = process.env.HOST || "localhost";
server.listen(PORT, HOST);
console.log(`Server started successfully on: http://${HOST}:${PORT}/`);

syncThemes();
setInterval(() => {
  syncThemes();
}, 1000 * 60 * 60); // every hour

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    server.server.close();
  });
}
