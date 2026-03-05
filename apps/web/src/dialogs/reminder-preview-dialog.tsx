import Dialog from "../components/dialog";
import { Button, Flex, Text } from "@theme-ui/components";
import { db } from "../common/db";
import { Reminder } from "@notesfriend/core";
import IconTag from "../components/icon-tag";
import { Clock, Refresh } from "../components/icons";
import Note from "../components/note";
import { getFormattedReminderTime, usePromise } from "@notesfriend/common";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";

export type ReminderPreviewDialogProps = BaseDialogProps<false> & {
  reminder: Reminder;
};

const RECURRING_MODE_MAP = {
  week: "Weekly",
  day: "Daily",
  month: "Monthly",
  year: "Yearly"
} as const;

const SNOOZE_TIMES = [
  {
    id: "5-min",
    title: strings.minutes(5),
    interval: 60 * 5 * 1000
  },
  {
    id: "10-min",
    title: strings.minutes(10),
    interval: 60 * 10 * 1000
  },
  { id: "15-min", title: strings.minutes(15), interval: 60 * 15 * 1000 },
  { id: "1-hour", title: strings.hours(1), interval: 60 * 60 * 1000 }
];

export const ReminderPreviewDialog = DialogManager.register(
  function ReminderPreviewDialog(props: ReminderPreviewDialogProps) {
    const { reminder } = props;
    const referencedNotes = usePromise(
      () =>
        db.relations
          .to({ id: reminder.id, type: "reminder" }, "note")
          .resolve(),
      [reminder.id]
    );

    return (
      <Dialog
        isOpen={true}
        title={reminder.title}
        description={reminder.description}
        onClose={() => props.onClose(false)}
        negativeButton={{
          text: strings.close(),
          onClick: () => props.onClose(false)
        }}
      >
        <Flex
          sx={{
            alignItems: "center",
            mb: 2
          }}
        >
          {reminder.mode === "repeat" && reminder.recurringMode && (
            <IconTag
              icon={Refresh}
              text={RECURRING_MODE_MAP[reminder.recurringMode]}
            />
          )}
          <IconTag icon={Clock} text={getFormattedReminderTime(reminder)} />
        </Flex>

        <Text variant="body">{strings.remindMeIn()}:</Text>
        <Flex
          sx={{
            alignItems: "center",
            my: 1,
            gap: 1
          }}
        >
          {SNOOZE_TIMES.map((time) => (
            <Button
              key={time.id}
              variant="secondary"
              onClick={() => {
                db.reminders.add({
                  id: reminder.id,
                  snoozeUntil: Date.now() + time.interval
                });
                props.onClose(false);
              }}
              sx={{
                borderRadius: 100,
                py: 1,
                px: 2,
                flexShrink: 0
              }}
            >
              {time.title}
            </Button>
          ))}
        </Flex>
        {referencedNotes &&
          referencedNotes.status === "fulfilled" &&
          referencedNotes.value.length > 0 && (
            <>
              <Text variant="body">{strings.references()}:</Text>
              {referencedNotes.value.map((item, index) => (
                <Note
                  key={item.id}
                  item={item}
                  date={item.dateCreated}
                  compact
                />
              ))}
            </>
          )}
      </Dialog>
    );
  }
);
