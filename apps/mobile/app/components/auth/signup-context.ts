import React, { useContext } from "react";

export const SignupContext = React.createContext<{
  signup: () => Promise<boolean | undefined>;
}>({
  signup: async () => {
    return false;
  }
});

export const useSignupContext = () => useContext(SignupContext);
