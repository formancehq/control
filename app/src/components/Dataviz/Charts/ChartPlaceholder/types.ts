export enum ChartPlaceholderTypes {
  LINE = 'line',
  PIE = 'pie',
}

export type ChartPlaceholderProps = {
  type: ChartPlaceholderTypes;
  title?: string;
  time?: { value: string; kind: string };
};
