import { useState, useEffect } from "react";
import { getCurrentPath, NavigationEvents } from "../navigation";

export default function useLocation() {
  const [location, setLocation] = useState(getCurrentPath());
  const [previousLocation, setPreviousLocation] = useState<string>();
  const [navigationState, setNavigationState] =
    useState<NavigationStates>("neutral");

  useEffect(() => {
    const navigateEvent = NavigationEvents.subscribe(
      "onNavigate",
      (_: any, currentLocation: string) => {
        setLocation((prev) => {
          setNavigationState(getNavigationState(currentLocation, prev));
          setPreviousLocation(prev);
          return currentLocation;
        });
      }
    );
    return () => {
      navigateEvent.unsubscribe();
    };
  }, []);
  return [location, previousLocation, navigationState] as const;
}

type NavigationStates = "forward" | "backward" | "same" | "neutral";
function getNavigationState(
  currentLocation: string,
  previousLocation: string
): NavigationStates {
  if (!previousLocation || !currentLocation) return "neutral";

  const currentLevels = currentLocation.split("/");
  const previousLevels = previousLocation.split("/");
  const isSameRoot = currentLevels[1] === previousLevels[1];
  return isSameRoot
    ? currentLevels.length > previousLevels.length
      ? "forward"
      : currentLevels.length < previousLevels.length
      ? "backward"
      : "same"
    : "neutral";
}
