import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import { Toast } from "../toast";
import { AuthMode, initialAuthMode } from "./common";
import { Login } from "./login";
import { Signup } from "./signup";
import { useThemeColors } from "@notesfriend/theme";
import { NavigationProps } from "../../services/navigation";

const Auth = ({ navigation, route }: NavigationProps<"Auth">) => {
  const [currentAuthMode, setCurrentAuthMode] = useState(
    route?.params?.mode || AuthMode.login
  );
  const { colors } = useThemeColors();
  initialAuthMode.current = route?.params.mode || AuthMode.login;
  useNavigationFocus(navigation, {});

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary.background }}
    >
      {currentAuthMode !== AuthMode.login &&
      currentAuthMode !== AuthMode.welcomeLogin ? (
        <Signup
          changeMode={(mode) => setCurrentAuthMode(mode)}
          welcome={initialAuthMode.current === AuthMode.welcomeSignup}
        />
      ) : (
        <Login changeMode={(mode) => setCurrentAuthMode(mode)} />
      )}

      <Toast context="local" />
    </SafeAreaView>
  );
};

export default Auth;
