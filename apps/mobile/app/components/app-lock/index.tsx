import React, { useCallback, useEffect, useRef } from "react";
import {
  AppStateStatus,
  Platform,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
//@ts-ignore
import { useThemeColors } from "@notesfriend/theme";
import { DatabaseLogger } from "../../common/database";
import {
  decrypt,
  encrypt,
  getCryptoKey,
  getDatabaseKey,
  setAppLockVerificationCipher,
  validateAppLockPassword
} from "../../common/database/encryption";
import { MMKV } from "../../common/database/mmkv";
import { useAppState } from "../../hooks/use-app-state";
import BiometricService from "../../services/biometrics";
import { ToastManager } from "../../services/event-manager";
import SettingsService from "../../services/settings";
import { useSettingStore } from "../../stores/use-setting-store";
import { useUserStore } from "../../stores/use-user-store";
import { NotesfriendModule } from "../../utils/notesfriend-module";
import { Toast } from "../toast";
import { Button } from "../ui/button";
import { IconButton } from "../ui/icon-button";
import Input from "../ui/input";
import Seperator from "../ui/seperator";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { strings } from "@notesfriend/intl";
import { AppFontSize } from "../../utils/size";
import { editorController } from "../../screens/editor/tiptap/utils";
import { useTabStore } from "../../screens/editor/tiptap/use-tab-store";

const getUser = () => {
  const user = MMKV.getString("user");
  if (user) {
    return JSON.parse(user);
  }
};

const verifyUserPassword = async (password: string) => {
  try {
    await getDatabaseKey();
    const key = await getCryptoKey();
    const user = getUser();
    const cipher = await encrypt(
      {
        key: key,
        salt: user.salt
      },
      "notesfriend"
    );
    const plainText = await decrypt({ password }, cipher);
    return plainText === "notesfriend";
  } catch (e) {
    DatabaseLogger.error(e as Error);
    return false;
  }
};

const AppLocked = () => {
  const initialLaunchBiometricRequest = useRef(true);
  const { colors } = useThemeColors();
  const user = getUser();
  const appLocked = useUserStore((state) => state.appLocked);
  const lockApp = useUserStore((state) => state.lockApp);
  const deviceMode = useSettingStore((state) => state.deviceMode);
  const passwordInputRef = useRef<TextInput>(null);
  const password = useRef<string>(undefined);
  const appState = useAppState();
  const lastAppState = useRef<AppStateStatus>(appState);
  const biometricUnlockAwaitingUserInput = useRef(false);
  const { height } = useWindowDimensions();
  const keyboardType = useSettingStore(
    (state) => state.settings.applockKeyboardType
  );
  const appLockHasPasswordSecurity = useSettingStore(
    (state) => state.settings.appLockHasPasswordSecurity
  );
  const biometricsAuthEnabled = useSettingStore(
    (state) =>
      state.settings.biometricsAuthEnabled === true ||
      (state.settings.biometricsAuthEnabled === undefined &&
        !state.settings.appLockHasPasswordSecurity)
  );

  const onUnlockAppRequested = useCallback(async () => {
    editorController.current?.commands.blur(useTabStore.getState().currentTab);
    editorController.current?.commands.blurPassInput();

    if (
      !biometricsAuthEnabled ||
      !(await BiometricService.isBiometryAvailable())
    ) {
      return;
    }

    biometricUnlockAwaitingUserInput.current = true;

    if (Platform.OS === "android") {
      const activityName = await NotesfriendModule.getActivityName();
      if (
        activityName !== "MainActivity" &&
        activityName !== "NotePreviewConfigureActivity"
      )
        return;
    }
    useSettingStore.getState().setRequestBiometrics(true);

    const unlocked = await BiometricService.validateUser(
      "Unlock to access your notes",
      ""
    );
    if (unlocked) {
      lockApp(false);
      password.current = undefined;
    }
    biometricUnlockAwaitingUserInput.current = false;
    setTimeout(() => {
      if (biometricUnlockAwaitingUserInput.current) return;
      useSettingStore.getState().setRequestBiometrics(false);
    }, 500);
  }, [biometricsAuthEnabled, lockApp]);

  const onSubmit = async () => {
    if (!password.current) return;
    try {
      const unlocked = appLockHasPasswordSecurity
        ? await validateAppLockPassword(password.current)
        : await verifyUserPassword(password.current);
      if (unlocked) {
        if (!appLockHasPasswordSecurity) {
          await setAppLockVerificationCipher(password.current);
          SettingsService.set({
            appLockHasPasswordSecurity: true,
            applockKeyboardType: "default"
          });
          DatabaseLogger.info("App lock migrated to password security");
        }

        lockApp(false);
        password.current = undefined;
      } else {
        ToastManager.show({
          heading: strings.invalid(keyboardType),
          type: "error",
          context: "local"
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const prevState = lastAppState.current;
    lastAppState.current = appState;

    if (
      appState === "active" &&
      (prevState === "background" || initialLaunchBiometricRequest.current)
    ) {
      if (SettingsService.shouldLockAppOnEnterForeground()) {
        if (useSettingStore.getState().appDidEnterBackgroundForAction) {
          useSettingStore.getState().setAppDidEnterBackgroundForAction(false);
          return;
        }

        DatabaseLogger.info("Locking app on entering foreground");

        useUserStore.getState().lockApp(true);
      }
      if (
        !(
          biometricUnlockAwaitingUserInput.current ||
          useUserStore.getState().disableAppLockRequests ||
          !appLocked ||
          useSettingStore.getState().requestBiometrics ||
          useSettingStore.getState().appDidEnterBackgroundForAction
        )
      ) {
        initialLaunchBiometricRequest.current = false;
        DatabaseLogger.info("Biometric unlock request");
        onUnlockAppRequested();
      }
    } else {
      SettingsService.appEnteredBackground();
    }
  }, [appState, onUnlockAppRequested, appLocked]);

  return appLocked ? (
    <KeyboardAwareScrollView
      style={{
        backgroundColor: colors.primary.background,
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 999
      }}
      contentContainerStyle={{
        justifyContent: "center",
        minHeight: height
      }}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <Toast context="local" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          width:
            deviceMode !== "mobile"
              ? "50%"
              : Platform.OS == "ios"
                ? "95%"
                : "100%",
          paddingHorizontal: 12,
          marginBottom: 30,
          marginTop: 15,
          alignSelf: "center"
        }}
      >
        <IconButton
          name="fingerprint"
          size={100}
          style={{
            width: 100,
            height: 100,
            marginBottom: 20,
            marginTop: user ? 0 : 50
          }}
          onPress={onUnlockAppRequested}
          color={colors.primary.border}
        />
        <Heading
          color={colors.primary.heading}
          style={{
            alignSelf: "center",
            textAlign: "center"
          }}
        >
          {strings.unlockNotes()}
        </Heading>

        <Paragraph
          style={{
            alignSelf: "center",
            textAlign: "center",
            maxWidth: "90%"
          }}
        >
          {strings.verifyItsYou()}
        </Paragraph>
        <Seperator />
        <View
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: colors.primary.background
          }}
        >
          {user || appLockHasPasswordSecurity ? (
            <>
              <Input
                fwdRef={passwordInputRef}
                secureTextEntry
                keyboardType={
                  appLockHasPasswordSecurity ? keyboardType : "default"
                }
                onLayout={async () => {
                  if (
                    !biometricsAuthEnabled ||
                    !(await BiometricService.isBiometryAvailable())
                  ) {
                    setTimeout(() => {
                      passwordInputRef.current?.focus();
                    }, 32);
                  }
                }}
                placeholder={
                  appLockHasPasswordSecurity
                    ? keyboardType === "numeric"
                      ? strings.enterApplockPassword()
                      : strings.enterApplockPin()
                    : strings.enterAccountPassword()
                }
                onChangeText={(v) => (password.current = v)}
                onSubmit={() => {
                  onSubmit();
                }}
              />
            </>
          ) : null}

          <View
            style={{
              marginTop: user ? 25 : 25
            }}
          >
            {user || appLockHasPasswordSecurity ? (
              <>
                <Button
                  title={strings.continue()}
                  type="accent"
                  onPress={onSubmit}
                  width={250}
                  height={45}
                  style={{
                    borderRadius: 150,
                    marginBottom: 10
                  }}
                />
              </>
            ) : null}

            {biometricsAuthEnabled ? (
              <Button
                title={strings.unlockWithBiometrics()}
                width={250}
                onPress={onUnlockAppRequested}
                icon={"fingerprint"}
                type="transparent"
              />
            ) : null}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  ) : null;
};

export default AppLocked;
