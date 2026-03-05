import React from "react";
import useHashRoutes from "../../hooks/use-hash-routes";
import hashroutes from "../../navigation/hash-routes";
import TabsView from "../editor";

function HashRouter() {
  useHashRoutes(hashroutes);
  return <TabsView />; // React.isValidElement(routeResult) ? routeResult : null;
}
export default React.memo(HashRouter, () => true);
