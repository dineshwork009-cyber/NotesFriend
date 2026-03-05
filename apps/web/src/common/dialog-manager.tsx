import React from "react";
import { createRoot } from "react-dom/client";

export interface BaseDialogProps<T = unknown> {
  onClose: (result: T) => void;
}

type PropsWithoutOnClose<Props extends BaseDialogProps<any>> = Omit<
  Props,
  "onClose"
>;

type DialogOptions<Props extends BaseDialogProps<any>> = {
  onBeforeOpen?: (
    props: PropsWithoutOnClose<Props>
  ) => boolean | Promise<boolean>;
};

class _DialogManager {
  private openedDialogs: Map<React.JSXElementConstructor<any>, () => void> =
    new Map();

  open<
    Props extends BaseDialogProps<any>,
    Result extends Props extends BaseDialogProps<infer T> ? T : unknown
  >(
    component: React.ComponentType<Props>,
    props: Omit<Props, "onClose">
  ): Promise<Result | false> {
    if (this.openedDialogs.has(component)) return Promise.resolve(false);

    const container = document.createElement("div");
    const root = createRoot(container);

    const Dialog = component as React.FunctionComponent<
      Omit<Props, "onClose"> & {
        onClose: (result: any) => void;
      }
    >;
    return new Promise<Result | false>((resolve, reject) => {
      const close = () => {
        this.openedDialogs.delete(component);
        root.unmount();
        container.remove();
      };
      this.openedDialogs.set(component, () => {
        close();
        resolve(false);
      });
      root.render(
        <Dialog
          {...props}
          onClose={(result: Result) => {
            try {
              close();
              resolve(result);
            } catch (e) {
              reject(e);
            }
          }}
        />
      );
    });
  }

  closeAll() {
    const dialogs = document.querySelectorAll(
      ".ReactModalPortal,[data-react-modal-body-trap]"
    );
    dialogs.forEach((elem) => elem.remove());

    for (const close of this.openedDialogs.values()) {
      close();
    }
  }

  register<Props extends BaseDialogProps<any>>(
    component: React.ComponentType<Props>,
    options?: DialogOptions<Props>
  ) {
    return {
      show: async (props: PropsWithoutOnClose<Props>) => {
        if (options?.onBeforeOpen && !(await options?.onBeforeOpen?.(props)))
          return false;
        return await this.open(component, props);
      },
      close: () => {
        const dialog = this.openedDialogs.get(component);
        if (!dialog) return;
        dialog();
      }
    };
  }
}

export const DialogManager = new _DialogManager();
