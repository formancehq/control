export type LineProps = {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill?: boolean;
      borderColor: string;
      tension?: number;
    }[];
  };
};
