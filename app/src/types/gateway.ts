export type GatewayVersion = {
  name: string;
  version: string;
  health: boolean;
};

export type Gateway = {
  region: string;
  versions: GatewayVersion[];
};

export enum GatewayServiceStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}
