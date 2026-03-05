import { Text, Flex, Button } from "@theme-ui/components";
import Dialog from "../components/dialog";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { useStore as useUserStore } from "../stores/user-store";
import { getSubscriptionInfo } from "./settings/components/user-profile";
import { strings } from "@notesfriend/intl";

type OnboardingDialogProps = BaseDialogProps<boolean>;
export const OnboardingDialog = DialogManager.register(
  function OnboardingDialog({ onClose }: OnboardingDialogProps) {
    const user = useUserStore((store) => store.user);
    const { title } = getSubscriptionInfo(user);

    return (
      <Dialog isOpen={true} width={500} onClose={() => onClose(false)}>
        <Flex
          sx={{
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto"
          }}
        >
          <Text variant={"heading"} mt={2}>
            {strings.welcomeToPlan(title + " plan")}
          </Text>
          <Text
            variant={"body"}
            sx={{
              textAlign: "center",
              maxWidth: "70%",
              color: "var(--paragraph-secondary)"
            }}
          >
            {strings.thankYouPrivacy()}
          </Text>
          <Button
            variant="accent"
            sx={{ borderRadius: 50, px: 30, mb: 4, mt: 4 }}
            onClick={() => onClose(false)}
          >
            {strings.continue()}
          </Button>
        </Flex>
      </Dialog>
    );
  }
);
