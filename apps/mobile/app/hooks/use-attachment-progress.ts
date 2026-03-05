import { useEffect, useState } from "react";
import { useAttachmentStore } from "../stores/use-attachment-store";
import { Attachment } from "@notesfriend/core";

type AttachmentProgress = {
  type: string;
  value?: number;
  percent?: string;
};

export const useAttachmentProgress = (
  attachment?: Attachment,
  encryption?: boolean
): [
  AttachmentProgress | undefined,
  (progress?: AttachmentProgress) => void
] => {
  const progress = useAttachmentStore((state) => state.progress);
  const [currentProgress, setCurrentProgress] = useState<
    AttachmentProgress | undefined
  >(
    encryption
      ? {
          type: "encrypt"
        }
      : undefined
  );

  useEffect(() => {
    const attachmentProgress = !attachment
      ? null
      : progress?.[attachment?.hash];
    if (attachmentProgress) {
      const type = attachmentProgress.type;
      const loaded =
        attachmentProgress.type === "download"
          ? attachmentProgress.recieved
          : attachmentProgress.sent;
      const value = loaded / attachmentProgress.total;
      setCurrentProgress({
        value: value * 100,
        percent: (value * 100).toFixed(0) + "%",
        type: type
      });
    } else {
      setTimeout(() => {
        setCurrentProgress(undefined);
      }, 300);
    }
  }, [attachment, progress]);

  return [currentProgress, setCurrentProgress];
};
