import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/core";
import useNavigationStore, { RouteName } from "../stores/use-navigation-store";

type NavigationFocus = {
  onFocus?: (prev: RefObject<boolean>) => boolean;
  onBlur?: (prev: RefObject<boolean>) => boolean;
  delay?: number;
  focusOnInit?: boolean;
};

export const useNavigationFocus = (
  navigation: NativeStackNavigationProp<Record<string, object | undefined>>,
  { onFocus, onBlur, delay, focusOnInit = true }: NavigationFocus
) => {
  const route = useRoute();
  const [isFocused, setFocused] = useState(focusOnInit);
  const prev = useRef(false);
  const isBlurred = useRef(false);

  const _onFocus = useCallback(() => {
    setTimeout(
      () => {
        const shouldFocus = onFocus ? onFocus(prev) : true;

        const routeName = route.name?.startsWith("Settings")
          ? "Settings"
          : route.name;
        useNavigationStore.getState().update(routeName as RouteName);

        if (shouldFocus) {
          setFocused(true);
          prev.current = true;
        }
        isBlurred.current = false;
      },
      isBlurred.current ? 0 : delay || 300
    );
  }, [delay, onFocus]);

  const _onBlur = useCallback(() => {
    isBlurred.current = true;
    setTimeout(() => {
      const shouldBlur = onBlur ? onBlur(prev) : true;
      if (shouldBlur) {
        prev.current = false;
        setFocused(false);
      }
    }, delay || 300);
  }, [delay, onBlur]);

  useEffect(() => {
    if (!navigation) return;
    const subs = [
      navigation.addListener("focus", _onFocus),
      navigation.addListener("blur", _onBlur)
    ];
    return () => {
      subs.forEach((sub) => sub());
    };
  }, [_onBlur, _onFocus, navigation]);

  return isFocused;
};
