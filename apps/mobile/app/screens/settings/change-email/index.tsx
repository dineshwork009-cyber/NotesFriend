import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { db } from "../../../common/database";
import { eSendEvent, ToastManager } from "../../../services/event-manager";
import { eUserLoggedIn } from "../../../utils/events";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../../utils/styles";
import Input from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

enum EmailChangeSteps {
  verify,
  changeEmail
}

export const ChangeEmail = () => {
  const [step, setStep] = useState(EmailChangeSteps.verify);
  const emailChangeData = useRef<{
    email?: string;
    password?: string;
    code?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const emailInputRef = useRef<TextInput>(null);
  const passInputRef = useRef<TextInput>(null);
  const codeInputRef = useRef<TextInput>(null);

  const onSubmit = async () => {
    try {
      if (step === EmailChangeSteps.verify) {
        if (
          !emailChangeData.current.email ||
          !emailChangeData.current.password ||
          error
        )
          return;
        setLoading(true);
        const verified = await db.user?.verifyPassword(
          emailChangeData.current.password
        );
        if (!verified) throw new Error(strings.passwordIncorrect());
        await db.user?.sendVerificationEmail(emailChangeData.current.email);
        setStep(EmailChangeSteps.changeEmail);
        setLoading(false);
      } else {
        if (
          !emailChangeData.current.email ||
          !emailChangeData.current.password ||
          error ||
          !emailChangeData.current.code
        )
          return;
        await db.user?.changeEmail(
          emailChangeData.current.email,
          emailChangeData.current.password,
          emailChangeData.current.code
        );
        eSendEvent(eUserLoggedIn);
        close?.();
        ToastManager.show({
          heading: strings.emailUpdated(emailChangeData.current.email),
          type: "success",
          context: "global"
        });
      }
    } catch (e) {
      setLoading(false);
      ToastManager.error(e as Error);
    }
  };

  return (
    <View style={{ paddingHorizontal: DefaultAppStyles.GAP }}>
      <View
        style={{
          marginTop: DefaultAppStyles.GAP_VERTICAL
        }}
      >
        {step === EmailChangeSteps.verify ? (
          <>
            <Input
              fwdRef={emailInputRef}
              placeholder={strings.enterNewEmail()}
              validationType="email"
              onErrorCheck={(e) => setError(e)}
              onChangeText={(email) => {
                emailChangeData.current.email = email;
              }}
            />
            <Input
              fwdRef={passInputRef}
              placeholder={strings.enterAccountPassword()}
              secureTextEntry
              onChangeText={(pass) => {
                emailChangeData.current.password = pass;
              }}
            />
          </>
        ) : (
          <>
            <Input
              key="code-input"
              fwdRef={codeInputRef}
              placeholder={strings.code()}
              defaultValue=""
              onChangeText={(code) => {
                emailChangeData.current.code = code;
              }}
            />
          </>
        )}
      </View>

      <Button
        title={
          loading
            ? undefined
            : step === EmailChangeSteps.verify
            ? strings.verify()
            : strings.changeEmail()
        }
        type="accent"
        style={{
          width: "100%"
        }}
        loading={loading}
        onPress={onSubmit}
      />
    </View>
  );
};
