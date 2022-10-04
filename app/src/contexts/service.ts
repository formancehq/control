import { createContext } from "react";

import { IApiClient } from "~/src/utils/api";

export type ServiceContext = {
  api: IApiClient;
  currentUser: any;
};
export const ServiceContext = createContext({} as ServiceContext);
