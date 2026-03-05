import { strings } from "@notesfriend/intl";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { db } from "../../common/database";
import BackupService from "../../services/backup";
import { eSendEvent, ToastManager } from "../../services/event-manager";
import Navigation from "../../services/navigation";
import { useUserStore } from "../../stores/use-user-store";
import { eOpenRecoveryKeyDialog } from "../../utils/events";
import { DefaultAppStyles } from "../../utils/styles";
import { Dialog } from "../dialog";
import { Button } from "../ui/button";
import Input from "../ui/input";
import { Notice } from "../ui/notice";
import { TextInput } from "react-native-gesture-handler";

export const ChangePassword = () => {
  const passwordInputRef = useRef<TextInput>(null);
  const password = useRef<string>(undefined);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const oldPassword = useRef<string>(undefined);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  const changePassword = async () => {
    if (!user?.isEmailConfirmed) {
      ToastManager.show({
        heading: strings.emailNotConfirmed(),
        message: strings.emailNotConfirmedDesc(),
        type: "error",
        context: "local"
      });
      return;
    }
    if (error || !oldPassword.current || !password.current) {
      ToastManager.show({
        heading: strings.allFieldsRequired(),
        message: strings.allFieldsRequiredDesc(),
        type: "error",
        context: "local"
      });
      return;
    }
    setLoading(true);
    try {
      const result = await BackupService.run(
        false,
        "change-password-dialog",
        "partial"
      );
      if (result.error) {
        throw new Error(strings.backupFailed() + `: ${result.error}`);
      }

      await db.user.changePassword(oldPassword.current, password.current);
      ToastManager.show({
        heading: strings.passwordChangedSuccessfully(),
        type: "success",
        context: "global"
      });
      setLoading(false);
      Navigation.goBack();
      eSendEvent(eOpenRecoveryKeyDialog);
    } catch (e) {
      setLoading(false);
      ToastManager.show({
        heading: strings.passwordChangeFailed(),
        message: (e as Error).message,
        type: "error",
        context: "local"
      });
    }
    setLoading(false);
  };

  return (
    <View
      style={{
        width: "100%",
        padding: DefaultAppStyles.GAP
      }}
    >
      <Dialog context="change-password-dialog" />
      <Input
        fwdRef={oldPasswordInputRef}
        onChangeText={(value) => {
          oldPassword.current = value;
        }}
        returnKeyLabel="Next"
        returnKeyType="next"
        secureTextEntry
        autoComplete="password"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={strings.oldPassword()}
      />

      <Input
        fwdRef={passwordInputRef}
        onChangeText={(value) => {
          password.current = value;
        }}
        onErrorCheck={(e) => setError(e)}
        returnKeyLabel={strings.next()}
        returnKeyType="next"
        secureTextEntry
        validationType="password"
        autoComplete="password"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={strings.newPassword()}
      />

      <Notice text={strings.changePasswordNotice()} type="alert" />

      <View style={{ height: 10 }} />

      <Notice text={strings.changePasswordNotice2()} type="alert" />

      <Button
        style={{
          marginTop: DefaultAppStyles.GAP_VERTICAL,
          width: "100%"
        }}
        loading={loading}
        onPress={changePassword}
        type="accent"
        title={loading ? null : strings.changePasswordConfirm()}
      />
    </View>
  );
};
