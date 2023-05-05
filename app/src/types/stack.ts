export type MembershipStack = {
  id: string;
  organizationId: string;
  name: string;
  createdAt: Date;
  region: string;
  kind: Environments;
};
export type MembershipOrganization = {
  id: string;
  name: string;
  createdAt: Date;
};

export enum Environments {
  PRODUCTION = 'production',
  SANDBOX = 'sandbox',
}
