import { Box, Flex } from "@theme-ui/components";
import Dialog from "../components/dialog";
import Field from "../components/field";
import { useRef } from "react";
import { db } from "../common/db";
import { showToast } from "../utils/toast";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";
import { checkFeature } from "../common";

type CreateColorDialogProps = BaseDialogProps<string | false>;
export const CreateColorDialog = DialogManager.register(
  function CreateColorDialog(props: CreateColorDialogProps) {
    const colorRef = useRef<HTMLInputElement>(null);
    const colorPickerRef = useRef<HTMLInputElement>(null);
    return (
      <Dialog
        testId="new-color-dialog"
        isOpen={true}
        title={strings.newColor()}
        onClose={() => props.onClose(false)}
        positiveButton={{
          form: "colorForm",
          type: "submit",
          text: strings.create()
        }}
        negativeButton={{
          text: strings.cancel(),
          onClick: () => props.onClose(false)
        }}
      >
        <Box
          as="form"
          id="colorForm"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = Object.fromEntries(
              new FormData(e.target as HTMLFormElement).entries()
            ) as { color: string; title: string };
            if (!validateHexColor(form.color)) {
              showToast("error", strings.invalidHexColor());
              return;
            }

            const colorId = await db.colors.add({
              colorCode: form.color,
              title: form.title
            });
            props.onClose(colorId || false);
          }}
        >
          <Field
            required
            label={strings.title()}
            id="title"
            name="title"
            autoFocus
            data-test-id="title-input"
          />
          <Flex sx={{ alignItems: "end" }}>
            <Field
              inputRef={colorRef}
              required
              label={strings.color()}
              id="color"
              name="color"
              data-test-id="color-input"
              sx={{ flex: 1 }}
              onChange={(e) => {
                const color = e.target.value;
                if (colorPickerRef.current && validateHexColor(color))
                  colorPickerRef.current.value = color;
              }}
            />
            <input
              ref={colorPickerRef}
              type="color"
              style={{
                height: 41,
                backgroundColor: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 5
              }}
              onChange={(e) => {
                if (colorRef.current) colorRef.current.value = e.target.value;
              }}
            />
          </Flex>
        </Box>
      </Dialog>
    );
  },
  { onBeforeOpen: () => checkFeature("colors") }
);

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
function validateHexColor(color: string) {
  return HEX_COLOR_REGEX.test(color);
}
