import { FlowInputOutput } from '~/src/types/orchestration';

export type ActivitiesWrapperProps = {
  isConnectable: boolean;
  data: {
    details: FlowInputOutput;
  };
};
