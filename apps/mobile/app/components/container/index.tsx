import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Dimensions, Platform, View, useWindowDimensions } from "react-native";
import useGlobalSafeAreaInsets from "../../hooks/use-global-safe-area-insets";
import useKeyboard from "../../hooks/use-keyboard";
import { useThemeColors } from "@notesfriend/theme";

export const Container = ({ children }: PropsWithChildren) => {
  const { colors } = useThemeColors();
  const insets = useGlobalSafeAreaInsets();
  const keyboard = useKeyboard();
  const [height, setHeight] = useState(0);
  const windowHeightRef = useRef(Dimensions.get("window").height);
  const { height: windowHeight } = useWindowDimensions();
  const timerRef = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => {
    if (windowHeight !== windowHeightRef.current) {
      setHeight(0);
      windowHeightRef.current = windowHeight;
    }
  }, [windowHeight]);

  return (
    <View
      style={{
        overflow: "hidden",
        paddingTop: Platform.OS === "android" ? 0 : insets.top,
        paddingBottom: Platform.OS === "android" ? 0 : insets.bottom,
        height: height || "100%",
        width: "100%",
        backgroundColor: colors.primary.background
      }}
      onLayout={(event) => {
        const height = event.nativeEvent.layout.height;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (!keyboard.keyboardShown) {
            setHeight(height);
          }
        }, 500);
      }}
    >
      {children}
    </View>
  );
};

export default Container;
