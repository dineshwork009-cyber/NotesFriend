import { ProgressDialog } from "../dialogs/progress-dialog";
import { removeStatus, updateStatus } from "../hooks/use-status";

type TaskType = "status" | "modal";
export type TaskAction<T> = (report: ProgressReportCallback) => T | Promise<T>;
type BaseTaskDefinition<TTaskType extends TaskType, TReturnType> = {
  type: TTaskType;
  action: TaskAction<TReturnType>;
};

type StatusTaskDefinition<TReturnType> = BaseTaskDefinition<
  "status",
  TReturnType
> & {
  title: string;
  id: string;
};

type ModalTaskDefinition<TReturnType> = BaseTaskDefinition<
  "modal",
  TReturnType
> & {
  title: string;
  subtitle?: string;
};

type TaskDefinition<TReturnType> =
  | StatusTaskDefinition<TReturnType>
  | ModalTaskDefinition<TReturnType>;

type TaskProgress = {
  total?: number;
  current?: number;
  text: string;
};

type ProgressReportCallback = (progress: TaskProgress) => void;

export class TaskManager {
  static async startTask<T>(task: TaskDefinition<T>): Promise<T | Error> {
    switch (task.type) {
      case "status": {
        const statusTask = task;
        updateStatus({
          key: statusTask.id,
          status: task.title
        });
        const result = await statusTask.action((progress) => {
          let percentage: number | undefined = undefined;
          if (progress.current && progress.total)
            percentage = Math.round((progress.current / progress.total) * 100);

          updateStatus({
            key: statusTask.id,
            status: progress.text,
            progress: percentage
          });
        });
        removeStatus(statusTask.id);
        return result;
      }
      case "modal": {
        return (await ProgressDialog.show({
          title: task.title,
          subtitle: task.subtitle,
          action: task.action
        })) as T;
      }
    }
  }
}
