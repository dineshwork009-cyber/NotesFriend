import { Button, Flex, Text } from "@theme-ui/components";
import { TipContext, useTip } from "../../hooks/use-tip";
import { Info, Sync } from "../icons";
import { useStore as useAppStore } from "../../stores/app-store";
import { strings } from "@notesfriend/intl";

type PlaceholderProps = { context: TipContext; text?: string };
function Placeholder(props: PlaceholderProps) {
  const { context, text } = props;
  const tip = useTip(context);
  const syncStatus = useAppStore((store) => store.syncStatus);
  const isFirstSync = useAppStore((store) => store.lastSynced === 0);

  if (isFirstSync && syncStatus.key === "syncing" && context === "notes") {
    return (
      <Flex
        variant="columnCenter"
        sx={{
          position: "relative",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "stretch",
          px: 6
        }}
      >
        <Flex
          sx={{
            border: "1px solid var(--accent)",
            alignItems: "center",
            borderRadius: 50,
            p: 1,
            py: "1.5px"
          }}
        >
          <Sync color="accent" size={12} sx={{ mr: "small" }} />
          <Text variant="subBody" sx={{ fontSize: 10 }} color="accent">
            {strings.syncingYourNotes()}
          </Text>
        </Flex>

        <Text variant="subBody" sx={{ fontSize: "body", mt: 1 }}>
          {strings.networkProgress(syncStatus.type || "sync")}{" "}
          {syncStatus.progress} {strings.items()}
        </Text>
      </Flex>
    );
  }
  if (!tip) return null;

  return (
    <>
      <Flex
        variant="columnCenter"
        sx={{
          position: "relative",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "stretch",
          px: 6
        }}
      >
        <Flex
          sx={{
            border: "1px solid var(--accent)",
            borderRadius: 50,
            p: 1,
            py: "1.5px"
          }}
        >
          <Info color="accent" size={13} sx={{ mr: "small" }} />
          <Text variant="subBody" sx={{ fontSize: 10 }} color="accent">
            {strings.tip()}
          </Text>
        </Flex>
        <Text variant="subBody" sx={{ fontSize: "body", mt: 1 }}>
          {text || tip.text}
        </Text>
        {tip.button && (
          <Button
            sx={{
              mt: 2,
              alignItems: "center",
              justifyContent: "center",
              display: "flex"
            }}
            variant="secondary"
            onClick={tip.button.onClick}
          >
            <Text mr={1} color="accent">
              {tip.button.title}
            </Text>
            {tip.button.icon && <tip.button.icon size={18} color="accent" />}
          </Button>
        )}
      </Flex>
    </>
  );
}
export default Placeholder;
