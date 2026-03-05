import React, { useEffect, useRef, useState } from "react";
import { Linking, View } from "react-native";
import {
  eSubscribeEvent,
  eUnSubscribeEvent
} from "../../../services/event-manager";
import { clearMessage } from "../../../services/message";
import SettingsService from "../../../services/settings";
import { STORE_LINK } from "../../../utils/constants";
import { eCloseRateDialog, eOpenRateDialog } from "../../../utils/events";
import { AppFontSize } from "../../../utils/size";
import { Button } from "../../ui/button";
import Seperator from "../../ui/seperator";
import SheetWrapper from "../../ui/sheet";
import Heading from "../../ui/typography/heading";
import Paragraph from "../../ui/typography/paragraph";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../../utils/styles";
const RateAppSheet = () => {
  const [visible, setVisible] = useState(false);
  const actionSheetRef = useRef();

  useEffect(() => {
    eSubscribeEvent(eOpenRateDialog, open);
    eSubscribeEvent(eCloseRateDialog, close);
    return () => {
      eUnSubscribeEvent(eOpenRateDialog, open);
      eUnSubscribeEvent(eCloseRateDialog, close);
    };
  }, []);

  const open = () => {
    setVisible(true);
  };
  useEffect(() => {
    if (visible) {
      actionSheetRef.current?.show();
    }
  }, [visible]);

  const close = () => {
    actionSheetRef.current?.hide();
  };

  const onClose = async () => {
    SettingsService.set({
      rateApp: Date.now() + 86400000 * 7
    });
    setVisible(false);
    clearMessage();
  };

  const rateApp = async () => {
    await Linking.openURL(STORE_LINK);
    SettingsService.set({
      rateApp: false
    });
    setVisible(false);
    clearMessage();
  };

  return !visible ? null : (
    <SheetWrapper centered={false} fwdRef={actionSheetRef} onClose={onClose}>
      <View
        style={{
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: DefaultAppStyles.GAP
        }}
      >
        <Heading>{strings.rateAppHeading()}</Heading>
        <Paragraph size={AppFontSize.md}>{strings.rateAppDesc()}</Paragraph>

        <Seperator half />
        <Button
          onPress={rateApp}
          width="100%"
          type="accent"
          title={strings.rateApp()}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 12,
            width: "100%",
            alignSelf: "center"
          }}
        >
          <Button
            onPress={async () => {
              SettingsService.set({
                rateApp: false
              });
              setVisible(false);
              clearMessage();
            }}
            type="error"
            width="48%"
            title={strings.never()}
          />
          <Button
            onPress={onClose}
            width="48%"
            type="secondary"
            title={strings.later()}
          />
        </View>
      </View>
    </SheetWrapper>
  );
};

export default RateAppSheet;
