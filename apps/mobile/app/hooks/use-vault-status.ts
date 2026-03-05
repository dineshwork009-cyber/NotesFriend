import React, { useCallback, useEffect } from "react";
import { db } from "../common/database";
import BiometricService from "../services/biometrics";
import { eSubscribeEvent, eUnSubscribeEvent } from "../services/event-manager";
import { useSettingStore } from "../stores/use-setting-store";

const VaultStatusDefaults = {
  exists: false,
  biometryEnrolled: false,
  isBiometryAvailable: false
};

export type VaultStatusType = {
  exists: boolean;
  biometryEnrolled: boolean;
  isBiometryAvailable: boolean;
};

export const useVaultStatus = () => {
  const [vaultStatus, setVaultStatus] = React.useState(VaultStatusDefaults);
  const isAppLoading = useSettingStore((state) => state.isAppLoading);

  const checkVaultStatus = useCallback(() => {
    db.vault?.exists().then(async (exists) => {
      const available = await BiometricService.isBiometryAvailable();
      const fingerprint = await BiometricService.hasInternetCredentials();
      setVaultStatus({
        exists: exists,
        biometryEnrolled: fingerprint,
        isBiometryAvailable: available ? true : false
      });
    });
  }, []);

  useEffect(() => {
    if (isAppLoading) return;
    checkVaultStatus();
    eSubscribeEvent("vaultUpdated", () => checkVaultStatus());
    return () => {
      eUnSubscribeEvent("vaultUpdated", () => checkVaultStatus());
    };
  }, [checkVaultStatus, isAppLoading]);

  return vaultStatus;
};
