export type MembershipStack = {
  id: string;
  organizationId: string;
  name: string;
  createdAt: Date;
  region: string;
  kind: Environments;
  uri: string;
};
export type MembershipOrganization = {
  id: string;
  name: string;
  createdAt: Date;
};
export type MembershipRegion = {
  id: string;
  tags: { env: string; provider: string; region: string; sandbox: boolean };
};

export enum Environments {
  PRODUCTION = 'production',
  SANDBOX = 'sandbox',
}
