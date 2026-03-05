import React, { useEffect, useRef } from "react";
import { getHomeRoute, navigate, NavigationEvents } from "../../navigation";
import { store as selectionStore } from "../../stores/selection-store";
import { useStore as useSearchStore } from "../../stores/search-store";
import useRoutes from "../../hooks/use-routes";
import RouteContainer from "../route-container";
import routes from "../../navigation/routes";
import { Freeze } from "react-freeze";
import { Flex } from "@theme-ui/components";

function CachedRouter() {
  const [RouteResult, location] = useRoutes(routes, {
    fallbackRoute: getHomeRoute(),
    hooks: {
      beforeNavigate: (location) => {
        selectionStore.toggleSelectionMode(false);
        useSearchStore.getState().resetSearch();
        if (location === "/") {
          console.log("Redirecting to", getHomeRoute());
          navigate(getHomeRoute());
          return false;
        }
        return true;
      }
    }
  });
  const cachedRoutes = useRef<Record<string, React.FunctionComponent>>({});

  useEffect(() => {
    if (!RouteResult) return;
    NavigationEvents.publish("onNavigate", RouteResult, location);
  }, [RouteResult, location]);

  if (!RouteResult) return null;
  if (
    RouteResult.key === "general" ||
    !cachedRoutes.current[RouteResult.key] ||
    RouteResult.noCache
  )
    cachedRoutes.current[RouteResult.key] =
      RouteResult.component as React.FunctionComponent;

  return (
    <RouteContainer {...RouteResult}>
      {Object.entries(cachedRoutes.current).map(([key, Component]) => (
        <Freeze key={key} freeze={key !== RouteResult.key}>
          <Flex
            id={key}
            key={key}
            sx={{
              flexDirection: "column",
              flex: 1,
              overflow: "hidden"
            }}
          >
            <Component key={key} {...RouteResult.props} />
          </Flex>
        </Freeze>
      ))}
    </RouteContainer>
  );
}

export default React.memo(CachedRouter);
