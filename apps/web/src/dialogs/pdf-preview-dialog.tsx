import React, { Suspense } from "react";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import Dialog from "../components/dialog";
import { Loading } from "../components/icons";

const PdfPreview = React.lazy(() => import("../components/pdf-preview"));

type PdfPreviewDialogProps = BaseDialogProps<boolean> & {
  url: string;
  hash: string;
};

export const PdfPreviewDialog = DialogManager.register(
  function PdfPreviewDialog({ onClose, url, hash }: PdfPreviewDialogProps) {
    return (
      <Dialog
        isOpen={true}
        width="100%"
        height="100%"
        noScroll
        sx={{
          py: 1
        }}
        onClose={() => onClose(false)}
      >
        <Suspense fallback={<Loading />}>
          <PdfPreview
            fileUrl={url}
            hash={hash}
            onClose={() => onClose(false)}
          />
        </Suspense>
      </Dialog>
    );
  }
);
