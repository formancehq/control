import { createContext } from "react";

export interface ClientStyleContextData {
  reset: () => void;
}

export default createContext<ClientStyleContextData>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => {},
});
