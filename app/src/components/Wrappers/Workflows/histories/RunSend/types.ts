import { OrchestrationStageSend } from '~/src/types/orchestration';

export type RunSendProps = {
  name: string;
  input: OrchestrationStageSend;
  terminated: boolean;
  startedAt: Date;
  terminatedAt: Date;
};
