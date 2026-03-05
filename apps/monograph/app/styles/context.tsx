import { createContext } from "react";

export type ClientStyleContextData = {
  reset: () => void;
};

export const ClientStyleContext = createContext<ClientStyleContextData | null>(
  null
);
