import { ChartTypes } from '~/src/types/chart';

export type ChartPlaceholderProps = {
  type: ChartTypes;
  title?: string;
  time?: { value: string; kind: string };
};
