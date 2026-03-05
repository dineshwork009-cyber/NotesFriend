import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, useWindowDimensions } from "react-native";
import { useCallback } from "react";

/**
 * A hook that detects floating keyboard on iPad
 * @returns Is keyboard floating or not
 */
const useIsFloatingKeyboard = () => {
  const { width, height } = useWindowDimensions();

  const [floating, setFloating] = useState<boolean>(false);
  const onKeyboardWillChangeFrame = useCallback(
    (event: KeyboardEvent) => {
      setFloating(
        event.endCoordinates.width === 0 || event.endCoordinates.width < width
      );
    },
    [width]
  );

  useEffect(() => {
    const sub1 = Keyboard.addListener(
      "keyboardWillChangeFrame",
      onKeyboardWillChangeFrame
    );
    const sub2 = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardWillChangeFrame
    );
    return () => {
      sub1?.remove();
      sub2?.remove();
    };
  }, [onKeyboardWillChangeFrame, width]);

  return floating;
};

export default useIsFloatingKeyboard;
