import { getFormattedDate } from "@notesfriend/common";
import { strings } from "@notesfriend/intl";
import { PopupPresenter } from "@notesfriend/ui";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRef, useState } from "react";
import { db } from "../common/db";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { DayPicker } from "../components/day-picker";
import Dialog from "../components/dialog";
import Field from "../components/field";
import { Calendar } from "../components/icons";
import { store } from "../stores/note-store";
import { useStore as useThemeStore } from "../stores/theme-store";
import { setDateOnly } from "../utils/date-time";
import { showToast } from "../utils/toast";

dayjs.extend(customParseFormat);

type NoteExpiryDateDialogProps = BaseDialogProps<boolean> & {
  noteId: string;
  expiryDate?: number | null;
};

export const NoteExpiryDateDialog = DialogManager.register(
  function NoteExpiryDateDialog(props: NoteExpiryDateDialogProps) {
    const { onClose, noteId, expiryDate } = props;
    const [date, setDate] = useState(
      expiryDate ? dayjs(expiryDate) : dayjs().add(7, "day")
    );
    const [showCalendar, setShowCalendar] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const theme = useThemeStore((store) => store.colorScheme);

    return (
      <Dialog
        isOpen={true}
        title={"Set Custom Expiry Date"}
        onClose={() => onClose(false)}
        width={400}
        positiveButton={{
          text: strings.done(),
          onClick: async () => {
            if (date.isBefore(dayjs())) {
              showToast("error", "Expiry date must be in the future");
              return;
            }
            await db.notes.setExpiryDate(date.valueOf(), noteId);
            store.refresh();
            showToast("success", "Expiry date set");
            onClose(true);
          }
        }}
        negativeButton={{
          text: strings.cancel(),
          onClick: () => onClose(false)
        }}
      >
        <Field
          id="date"
          label={strings.date()}
          required
          inputRef={dateInputRef}
          helpText={`${db.settings.getDateFormat()}`}
          action={{
            icon: Calendar,
            onClick() {
              setShowCalendar(true);
            }
          }}
          validate={(t) =>
            dayjs(t, db.settings.getDateFormat(), true).isValid()
          }
          defaultValue={date.format(db.settings.getDateFormat())}
          onChange={(e) => setDate((d) => setDateOnly(e.target.value, d))}
        />
        <PopupPresenter
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
          position={{
            isTargetAbsolute: true,
            target: dateInputRef.current,
            location: "top"
          }}
        >
          <DayPicker
            sx={{
              bg: "background",
              p: 2,
              boxShadow: `0px 0px 25px 5px ${
                theme === "dark" ? "#000000aa" : "#0000004e"
              }`,
              borderRadius: "dialog",
              width: 300
            }}
            selected={dayjs(date).toDate()}
            minDate={dayjs().add(1, "day").toDate()}
            maxDate={dayjs().add(1, "year").toDate()}
            onSelect={(day) => {
              if (!day) return;
              const dateStr = getFormattedDate(day, "date");
              setDate((d) => setDateOnly(dateStr, d));
              if (dateInputRef.current) dateInputRef.current.value = dateStr;
              setShowCalendar(false);
            }}
          />
        </PopupPresenter>
      </Dialog>
    );
  }
);
