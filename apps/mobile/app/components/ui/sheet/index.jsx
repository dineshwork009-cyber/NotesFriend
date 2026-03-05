import { ScopedThemeProvider, useThemeColors } from "@notesfriend/theme";
import React, { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import useGlobalSafeAreaInsets from "../../../hooks/use-global-safe-area-insets";
import { useSettingStore } from "../../../stores/use-setting-store";
import { useUserStore } from "../../../stores/use-user-store";
import { getContainerBorder } from "../../../utils/colors";
import { NotesfriendModule } from "../../../utils/notesfriend-module";
import { Toast } from "../../toast";

/**
 *
 * @param {any} param0
 * @returns
 */
const SheetWrapper = ({
  children,
  fwdRef,
  gestureEnabled = true,
  onClose,
  onOpen,
  closeOnTouchBackdrop = true,
  onHasReachedTop,
  overlay,
  overlayOpacity = 0.7,
  enableGesturesInScrollView = false,
  bottomPadding = true,
  keyboardHandlerDisabled
}) => {
  const localRef = useRef(null);
  const { colors } = useThemeColors("sheet");
  const deviceMode = useSettingStore((state) => state.deviceMode);
  const sheetKeyboardHandler = useSettingStore(
    (state) => state.sheetKeyboardHandler
  );
  const largeTablet = deviceMode === "tablet";
  const smallTablet = deviceMode === "smallTablet";
  const dimensions = useSettingStore((state) => state.dimensions);
  const insets = useGlobalSafeAreaInsets();
  const lockEvents = useRef(false);
  const locked = useUserStore((state) => state.appLocked);
  let width = dimensions.width > 600 ? 600 : 500;
  const isGestureNavigationEnabled =
    NotesfriendModule.isGestureNavigationEnabled();
  const bottomInsets = insets.bottom || (isGestureNavigationEnabled ? 20 : 49);
  const style = React.useMemo(() => {
    return {
      width: largeTablet || smallTablet ? width : "100%",
      backgroundColor: colors.primary.background,
      zIndex: 10,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      alignSelf: "center",
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      ...getContainerBorder(colors.primary.border, 0.5),
      borderBottomWidth: 0,
      paddingBottom:
        Platform.OS === "android" && !bottomInsets
          ? isGestureNavigationEnabled
            ? 0
            : 30
          : 0
    };
  }, [
    colors.primary.background,
    colors.primary.border,
    largeTablet,
    smallTablet,
    width,
    insets.bottom
  ]);

  const _onOpen = () => {
    if (lockEvents.current) return;
    onOpen && onOpen();
  };

  const _onClose = async () => {
    if (lockEvents.current) return;
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (locked) {
      const ref = fwdRef || localRef;
      ref?.current?.hide();
      if (useUserStore.getState().appLocked) {
        lockEvents.current = true;
        const unsub = useUserStore.subscribe((state) => {
          if (!state.appLocked) {
            ref?.current?.show();
            unsub();
            lockEvents.current = false;
          }
        });
      }
    }
  }, [locked, fwdRef]);

  return (
    <ScopedThemeProvider value="sheet">
      <ActionSheet
        ref={fwdRef || localRef}
        testIDs={{
          backdrop: "sheet-backdrop"
        }}
        indicatorStyle={{
          width: 100,
          backgroundColor: colors.secondary.background
        }}
        statusBarTranslucent
        drawUnderStatusBar={true}
        containerStyle={style}
        gestureEnabled={gestureEnabled}
        onPositionChanged={onHasReachedTop}
        closeOnTouchBackdrop={closeOnTouchBackdrop}
        keyboardHandlerEnabled={
          keyboardHandlerDisabled ? false : sheetKeyboardHandler
        }
        closeOnPressBack={closeOnTouchBackdrop}
        indicatorColor={colors.secondary.background}
        onOpen={_onOpen}
        enableGesturesInScrollView={enableGesturesInScrollView}
        defaultOverlayOpacity={overlayOpacity}
        overlayColor={colors.primary.backdrop}
        ExtraOverlayComponent={
          <>
            {overlay}
            <Toast context="local" />
          </>
        }
        onClose={_onClose}
      >
        {children}

        {bottomPadding ? (
          <View
            style={{
              height: bottomInsets
            }}
          />
        ) : null}
      </ActionSheet>
    </ScopedThemeProvider>
  );
};

export default SheetWrapper;
