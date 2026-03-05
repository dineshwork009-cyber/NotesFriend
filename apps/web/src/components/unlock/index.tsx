import { useRef, useState, useCallback } from "react";
import { Flex, Text, Button } from "@theme-ui/components";
import { Lock } from "../icons";
import Field from "../field";
import { showToast } from "../../utils/toast";
import { ErrorText } from "../error-text";
import { strings } from "@notesfriend/intl";

type UnlockViewProps = {
  title: string;
  subtitle: string;
  buttonTitle: string;
  unlock: (password: string) => Promise<void>;
};
export function UnlockView(props: UnlockViewProps) {
  const { title, subtitle, buttonTitle, unlock } = props;
  const [isWrong, setIsWrong] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(async () => {
    if (!passwordRef.current?.value) return;
    setIsUnlocking(true);
    const password = passwordRef.current.value;
    try {
      await unlock(password);
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes("ciphertext cannot be decrypted using that key")
      ) {
        setIsWrong(true);
      } else {
        showToast("error", `${strings.couldNotUnlock()}: ` + e);
        console.error(e);
      }
    } finally {
      setIsUnlocking(false);
    }
  }, [setIsWrong, unlock]);

  return (
    <Flex
      mx={2}
      sx={{
        flex: "1",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Lock size={100} sx={{ opacity: 0.2 }} />
        <Text
          data-test-id="unlock-note-title"
          variant="heading"
          mx={100}
          mt={25}
          sx={{ fontSize: 36, textAlign: "center" }}
        >
          {title}
        </Text>
      </Flex>
      <Text
        variant="body"
        mt={1}
        mb={4}
        sx={{
          textAlign: "center",
          fontSize: "title",
          color: "var(--paragraph-secondary)"
        }}
      >
        {subtitle}
      </Text>
      <Field
        id="vaultPassword"
        data-test-id="unlock-note-password"
        inputRef={passwordRef}
        autoFocus
        sx={{ width: ["95%", "95%", "max(30%, 400px)"] }}
        placeholder={strings.enterPassword()}
        type="password"
        onKeyUp={async (e) => {
          if (e.key === "Enter") {
            await submit();
          } else if (isWrong) {
            setIsWrong(false);
          }
        }}
      />
      {isWrong && <ErrorText error="Wrong password" />}
      <Button
        mt={3}
        variant="accent"
        data-test-id="unlock-note-submit"
        disabled={isUnlocking}
        sx={{ borderRadius: 100, px: 30 }}
        onClick={async () => {
          await submit();
        }}
      >
        {isUnlocking ? strings.unlocking() + "..." : buttonTitle}
      </Button>
    </Flex>
  );
}
