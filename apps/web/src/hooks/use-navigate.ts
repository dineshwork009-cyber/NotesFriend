import { useEffect } from "react";
import { NavigationEvents } from "../navigation";

function useNavigate(routeKey: string, onNavigation: () => void) {
  useEffect(() => {
    onNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onNavigate(route: { key: string }) {
      if (route?.key === routeKey) {
        onNavigation();
      }
    }
    NavigationEvents.subscribe("onNavigate", onNavigate);
    return () => {
      NavigationEvents.unsubscribe("onNavigate", onNavigate);
    };
  }, [routeKey, onNavigation]);
}
export default useNavigate;
