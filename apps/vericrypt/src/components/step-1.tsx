import { Button, Link, Text } from "@theme-ui/components";
import { StepContainer } from "./step-container";
import { Code } from "./code";
import { getPackageUrl } from "../utils/links";

export function LoginToNotesfriend() {
  return (
    <StepContainer
      onSubmit={(e) => {
        e.preventDefault();
        document.getElementById("step_2")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        return false;
      }}
      onSubmitCapture={() => false}
      as="form"
      sx={{ flexDirection: "column" }}
    >
      <Text variant="title">Welcome to Vericrypt</Text>
      <Text as="p" variant="body" sx={{ mt: 1 }}>
        <del>
          Trust is a huge problem in closed source end-to-end encrypted
          applications. How can you be sure that the app is actually encrypting
          your data?
        </del>
      </Text>
      <Text as="p" variant="body" sx={{ mt: 1 }}>
        The only way to earn a user&apos;s trust is by allowing them to see how
        the underlying encryption actually works. To do this,{" "}
        <Link
          target="_blank"
          href="https://blog.notesfriend.com/notesfriend-is-going-open-source"
          sx={{ color: "primary", fontWeight: "bold" }}
        >
          we have completely open sourced Notesfriend.
        </Link>
      </Text>
      <Text as="p" variant="body" sx={{ mt: 1 }}>
        Yes, that&apos;s right. Notesfriend is now 100% open source under the
        GPLv3 license. That includes the app, the encryption library, the
        backend server, and everything else.
      </Text>
      <Text as="p" variant="body" sx={{ mt: 1 }}>
        However, even with an open source app, how can you be sure that the app
        is actually encrypting your data? That is why we have made this tool
        (also open source), which uses{" "}
        <Code text="@notesfriend/crypto" href={getPackageUrl("crypto")} /> — the
        main library for all cryptographic operations inside Notesfriend.
      </Text>
      <Text as="p" variant="body" sx={{ mt: 1 }}>
        Vericrypt will allow you to verify all encryption claims made by
        Notesfriend in a practical &amp; provable way right inside your browser.
      </Text>
      <Text
        as="p"
        variant="body"
        sx={{ mt: 1, bg: "bgSecondary", p: 2, borderRadius: 5 }}
      >
        When you use this tool, you&apos;ll be guided each step of the way to
        extract/insert raw data from raw sources.{" "}
        <b>The whole process happens completely in your browser offline</b> and
        you can even disconnect your internet to make sure we aren&apos;t just
        saying that.
      </Text>
      <Button
        sx={{ alignSelf: "center", mt: 2 }}
        onClick={() => window.open("https://app.notesfriend.com/login", "_blank")}
      >
        Login to Notesfriend
      </Button>
    </StepContainer>
  );
}
