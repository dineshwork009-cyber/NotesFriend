import { useState } from "react";
import { Copy, Loading } from "../../../components/icons";
import { Button, Link, Flex, Text, Grid } from "@theme-ui/components";
import { usePromise } from "@notesfriend/common";
import { db } from "../../../common/db";
import { writeToClipboard } from "../../../utils/clipboard";
import { showToast } from "../../../utils/toast";
import { ErrorText } from "../../../components/error-text";
import { useStore as useUserStore } from "../../../stores/user-store";
import { SubscriptionPlan, SubscriptionStatus } from "@notesfriend/core";
import { BuyDialog } from "../../buy-dialog";
import { strings } from "@notesfriend/intl";

export function CirclePartners() {
  const partners = usePromise(() => db.circle.partners(), []);
  const [redeemedCode, setRedeemedCode] = useState<{
    partnerId: string;
    code: string;
  }>();
  const subscription = useUserStore((store) => store.user?.subscription);

  const isFree =
    !subscription ||
    subscription?.plan === SubscriptionPlan.FREE ||
    subscription?.status === SubscriptionStatus.EXPIRED;
  const isTrial = subscription?.status === SubscriptionStatus.TRIAL;
  const canRedeem = !isFree && !isTrial;

  return (
    <>
      {partners.status === "pending" ? (
        <Loading sx={{ mt: 2 }} />
      ) : partners.status === "rejected" ? (
        <ErrorText error={partners.reason} />
      ) : (
        <Grid columns={2} sx={{ mt: 2 }}>
          {partners.value?.map((partner) => (
            <Flex
              key={partner.id}
              sx={{
                flexDirection: "column",
                border: "1px solid var(--border)",
                borderRadius: "dialog",
                padding: 2,
                gap: 1
              }}
            >
              <Flex
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Text variant="title">{partner.name}</Text>
                <img
                  src={partner.logoBase64}
                  alt={partner.name}
                  style={{ width: 30, height: "auto", borderRadius: 8 }}
                />
              </Flex>
              <Text variant="body" sx={{ whiteSpace: "pre-wrap" }}>
                {partner.shortDescription}
              </Text>
              <Text
                variant="subBody"
                sx={{
                  fontStyle: "italic",
                  color: "accent",
                  textAlign: "center"
                }}
              >
                {partner.offerDescription}
              </Text>
              {redeemedCode?.partnerId === partner.id ? (
                <>
                  <Flex
                    sx={{
                      bg: "background-secondary",
                      border: "1px solid var(--border)",
                      borderRadius: "default",
                      alignSelf: "center",
                      alignItems: "center",
                      gap: 1,
                      p: "small"
                    }}
                  >
                    <Text
                      variant="body"
                      className="selectable"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 14
                      }}
                    >
                      {redeemedCode.code}
                    </Text>
                    <Button
                      variant="icon"
                      onClick={() =>
                        writeToClipboard({ "text/plain": redeemedCode.code })
                      }
                    >
                      <Copy size={12} />
                    </Button>
                  </Flex>
                  {partner.codeRedeemUrl ? (
                    <Text variant="subBody" sx={{ textAlign: "center" }}>
                      <Link
                        target="_blank"
                        href={partner.codeRedeemUrl.replace(
                          "{{code}}",
                          redeemedCode.code
                        )}
                      >
                        Click here
                      </Link>{" "}
                      to directly claim the promotion.
                    </Text>
                  ) : null}
                </>
              ) : (
                <Button
                  variant="accent"
                  sx={{ mt: 1 }}
                  onClick={async () => {
                    if (isFree) return BuyDialog.show({});
                    if (isTrial) {
                      return showToast(
                        "error",
                        strings.trialUserCircleNotice()
                      );
                    }
                    if (!canRedeem) return;
                    const result = await db.circle
                      .redeem(partner.id)
                      .catch((e) => {
                        showToast("error", e.message);
                      });
                    if (result?.code) {
                      setRedeemedCode({
                        partnerId: partner.id,
                        code: result.code
                      });
                      showToast("success", "Code redeemed successfully");
                    }
                  }}
                >
                  {isFree ? strings.upgradeToRedeem() : strings.redeemCode()}
                </Button>
              )}
            </Flex>
          ))}
        </Grid>
      )}
    </>
  );
}
