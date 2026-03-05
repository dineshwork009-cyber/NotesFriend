import { create } from "zustand";
import { create as produce } from "mutative";
import { Icon } from "../components/icons";

type Status = {
  key: string;
  status: string;
  total?: number;
  current?: number;
  progress?: number;
  icon?: Icon | null;
};
interface IStatusStore {
  statuses: Record<string, Status>;
  getStatus: (key: string) => Status;
  updateStatus: (status: Status) => void;
  removeStatus: (key: string) => void;
}
const useStatusStore = create<IStatusStore>((set, get) => ({
  statuses: {},
  getStatus: (key: string) => get().statuses[key],
  updateStatus: ({ key, status, progress, icon, current, total }: Status) =>
    set(
      produce((state) => {
        if (!key) return;
        const { statuses } = state;
        const statusText = status || statuses[key]?.status;
        statuses[key] = {
          current,
          total,
          key,
          status: statusText,
          progress,
          icon
        };
      })
    ),
  removeStatus: (key) =>
    set(
      produce((state) => {
        const { statuses } = state;
        if (!key || !statuses[key]) return;
        delete statuses[key];
      })
    )
}));

export default function useStatus() {
  const statuses = useStatusStore((store) => store.statuses);
  return Object.values(statuses);
}

export const updateStatus = useStatusStore.getState().updateStatus;
export const removeStatus = useStatusStore.getState().removeStatus;
export const getStatus = useStatusStore.getState().getStatus;

export function statusToString(status: Status) {
  const parts: string[] = [];
  if (status.progress) parts.push(`${status.progress}%`);
  parts.push(status.status);
  if (status.total !== undefined && status.current !== undefined)
    parts.push(`(${status.current}/${status.total})`);
  return parts.join(" ");
}
