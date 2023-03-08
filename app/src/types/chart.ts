export type ChartDataset = {
  label?: string;
  hoverBorderColor?: string;
  data: number[];
  borderWidth?: number;
  fill?: boolean;
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  tension?: number;
  labels: string[] | Date[];
};

export type Chart = {
  labels: (Date | string)[];
  datasets: Omit<ChartDataset, 'labels'>[];
};

export enum ChartTypes {
  LINE = 'line',
  PIE = 'pie',
}
