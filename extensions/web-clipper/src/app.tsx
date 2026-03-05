import { useEffect, useMemo } from "react";
import { useAppStore } from "./stores/app-store";
import { Login } from "./views/login";
import { Main } from "./views/main";
import { Settings } from "./views/settings";
import {
  EmotionThemeProvider,
  themeToCSS,
  useThemeEngineStore
} from "@notesfriend/theme";
import { Global, css } from "@emotion/react";

export function App() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const user = useAppStore((s) => s.user);
  const route = useAppStore((s) => s.route);
  const navigate = useAppStore((s) => s.navigate);
  const theme = useThemeEngineStore((store) => store.theme);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else navigate("/");
  }, [isLoggedIn]);

  useEffect(() => {
    if (user && user.theme) {
      document.body.style.backgroundColor =
        user.theme.scopes.base.primary.background;
      useThemeEngineStore.getState().setTheme(user.theme);
    }
  }, [user]);
  const cssTheme = useMemo(() => themeToCSS(theme), [theme]);

  return (
    <>
      <Global
        styles={css`
          ${cssTheme}
        `}
      />
      <EmotionThemeProvider scope="base" injectCssVars>
        {(() => {
          switch (route) {
            case "/login":
              return <Login />;
            default:
            case "/":
              return <Main />;
            case "/settings":
              return <Settings />;
          }
        })()}
      </EmotionThemeProvider>
    </>
  );
}
