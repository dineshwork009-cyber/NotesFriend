import TaskSchedulerWorker from "./task-scheduler.worker.ts?worker";
import type {
  TaskScheduler as TaskSchedulerType,
  TaskSchedulerEvent
} from "./task-scheduler.worker";
import { wrap, Remote } from "comlink";
import { showToast } from "./toast";
import { logger } from "./logger";
import { validate } from "cronosjs";
import { strings } from "@notesfriend/intl";

let worker: globalThis.Worker | undefined;
let scheduler: Remote<TaskSchedulerType> | undefined;

export class TaskScheduler {
  static async register(id: string, time: string, action: () => void) {
    if (!validate(time)) {
      logger.error(`Invalid cron expression: ${time}`);
      return;
    }

    init();

    worker?.addEventListener("message", function handler(ev) {
      const { data } = ev as MessageEvent<TaskSchedulerEvent>;
      if (data.id !== id) return;

      switch (data.type) {
        case "task-run":
          action();
          break;
        case "task-stop":
        case "task-end":
          worker?.removeEventListener("message", handler);
          break;
      }
    });
    try {
      await scheduler?.registerTask(id, time);
    } catch (e) {
      showToast(
        "error",
        `${strings.failedToRegisterTask()}: ${
          (e as Error).message
        } (cron: ${time})`
      );
    }
  }

  static async stop(id: string) {
    await scheduler?.stop(id);
  }

  static async stopAll() {
    await scheduler?.stopAll();
    worker?.terminate();
  }

  static async stopAllWithPrefix(prefix: string) {
    await scheduler?.stopAllWithPrefix(prefix);
  }
}

function init() {
  if (worker) return;

  worker = new TaskSchedulerWorker();
  if (worker) scheduler = wrap<TaskSchedulerType>(worker);
}
