export type GatewayVersion = {
  name: string;
  version: string;
  health: boolean;
};

export type Gateway = {
  env: string;
  region: string;
  versions: GatewayVersion[];
};

export enum GatewayServiceStatus {
  UP = 'HEALTHY',
  DOWN = 'UNHEALTHY',
}
