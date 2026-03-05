import { ScopedThemeProvider } from "@notesfriend/theme";
import React, { useEffect, useState } from "react";
import ShareView from "./share";
import "./store";

const NotesfriendShare = () => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 1);
  }, []);
  return (
    <ScopedThemeProvider value="base">
      {!render ? null : <ShareView />}
    </ScopedThemeProvider>
  );
};

export default NotesfriendShare;
