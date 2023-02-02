export type ChartDataset = {
  label: string;
  data: number[];
  fill?: boolean;
  borderColor: string;
  tension?: number;
  labels: string[] | Date[];
};

export type LineChart = {
  labels: string[];
  datasets: Omit<ChartDataset, 'labels'>[];
};
