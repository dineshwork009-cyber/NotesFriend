import { initialize, logger as _logger, logManager } from "@notesfriend/core";
import { LogMessage, NoopLogger, format } from "@notesfriend/logger";
import { ZipFile } from "./streams/zip-stream";
import { createWriteStream } from "./stream-saver";
import { sanitizeFilename } from "@notesfriend/common";
import { createDialect } from "../common/sqlite";
import { isFeatureSupported } from "./feature-check";

let logger: typeof _logger = new NoopLogger();
async function initializeLogger() {
  const multiTab = !!globalThis.SharedWorker && isFeatureSupported("opfs");
  await initialize(
    {
      dialect: (name, init) =>
        createDialect({
          name,
          init,
          async: !isFeatureSupported("opfs"),
          multiTab,
          encrypted: false
        }),
      ...(IS_DESKTOP_APP || isFeatureSupported("opfs")
        ? { journalMode: "WAL", lockingMode: "exclusive" }
        : {
            journalMode: "MEMORY",
            lockingMode: "exclusive"
          }),
      tempStore: "memory",
      synchronous: "normal",
      pageSize: 8192,
      cacheSize: -32000,
      skipInitialization: !IS_DESKTOP_APP && multiTab
    },
    false
  );
  logger = _logger.scope("notesfriend-web");
}

async function downloadLogs() {
  if (!logManager) return;
  const { createZipStream } = await import("./streams/zip-stream");
  const allLogs = await logManager.get();
  let i = 0;
  const textEncoder = new TextEncoder();
  await new ReadableStream<ZipFile>({
    pull(controller) {
      const log = allLogs[i++];
      if (!log) {
        controller.close();
        return;
      }
      controller.enqueue({
        path: sanitizeFilename(log.key, { replacement: "-" }) + ".log",
        data: textEncoder.encode(
          (log.logs as LogMessage[]).map((line) => format(line)).join("\n")
        )
      });
    }
  })
    .pipeThrough(createZipStream())
    .pipeTo(await createWriteStream("notesfriend-logs.zip"));
}

async function clearLogs() {
  if (!logManager) return;

  await logManager.clear();
}

export { initializeLogger, logger, downloadLogs, clearLogs };
