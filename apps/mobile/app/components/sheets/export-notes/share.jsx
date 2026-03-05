import React from "react";
import { View } from "react-native";
import FileViewer from "react-native-file-viewer";
import { ToastManager } from "../../../services/event-manager";
import { AppFontSize } from "../../../utils/size";
import { Button } from "../../ui/button";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../../utils/styles";
export const ShareComponent = ({ uri, name, padding }) => {
  return (
    <View
      style={{
        paddingHorizontal: padding
      }}
    >
      <Button
        title={strings.open()}
        type="accent"
        width="100%"
        onPress={async () => {
          FileViewer.open(uri, {
            showOpenWithDialog: true,
            showAppsSuggestions: true
          }).catch(() => {
            ToastManager.show({
              heading: strings.noApplicationFound(name),
              type: "success",
              context: "local"
            });
          });
        }}
      />
      <Button
        title={strings.share()}
        type="shade"
        width="100%"
        style={{
          marginTop: DefaultAppStyles.GAP_VERTICAL
        }}
        onPress={async () => {
          FileViewer.open(uri, {
            showOpenWithDialog: true,
            showAppsSuggestions: true,
            shareFile: true
          }).catch(() => {
            /* empty */
          });
        }}
      />
    </View>
  );
};
