import { CronosTask, CronosExpression } from "cronosjs";
import { expose } from "comlink";

const RUNNING_TASKS: Record<string, CronosTask> = {};
const module = {
  registerTask: (id: string, pattern: string) => {
    if (RUNNING_TASKS[id]) module.stop(id);

    const expression = CronosExpression.parse(pattern, { strict: true });
    const task = new CronosTask(expression);

    task
      .on("started", () => {
        console.log("started", id, pattern);
        RUNNING_TASKS[id] = task;
      })
      .on("run", () => {
        globalThis.postMessage({ type: "task-run", id });
      })
      .on("stopped", () => {
        console.log("stopping", id, pattern);
        globalThis.postMessage({ type: "task-stop", id });
      })
      .on("ended", () => {
        globalThis.postMessage({ type: "task-end", id });
        delete RUNNING_TASKS[id];
      })
      .start();
  },
  stop: (id: string) => {
    if (RUNNING_TASKS[id] && RUNNING_TASKS[id].isRunning) {
      RUNNING_TASKS[id].stop();
      delete RUNNING_TASKS[id];
    }
  },
  stopAllWithPrefix: (prefix: string) => {
    for (const id in RUNNING_TASKS) {
      if (id.startsWith(prefix)) module.stop(id);
    }
  },
  stopAll: () => {
    for (const id in RUNNING_TASKS) {
      module.stop(id);
    }
  }
};

expose(module);
export type TaskScheduler = typeof module;
export type TaskSchedulerEvent = {
  type: "task-run" | "task-stop" | "task-end";
  id: string;
};
