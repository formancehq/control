import { ObjectOf } from '~/src/types/generic';

export type OAuthSecret = {
  lastDigits: string;
  name: string;
  id: string;
  metadata: ObjectOf<any>;
  clear?: string;
};

export type OAuthClient = {
  public: boolean;
  redirectUris: string[];
  description: string;
  name: string;
  trusted: boolean;
  postLogoutRedirectUris: string[];
  metadata: ObjectOf<any>;
  id: string;
  scopes: string[];
  Secrets: OAuthSecret[];
};
