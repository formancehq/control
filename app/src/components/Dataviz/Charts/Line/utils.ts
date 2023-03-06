import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { ObjectOf, theme } from "@numaryhq/storybook";
import { ChartDataset } from "~/src/types/chart";
import { Bucket } from "~/src/types/search";

dayjs.extend(localizedFormat);

export const top3color = (index: number) => {
  const colorMap = ["yellow", "violet", "blue"];
  return colorMap[index];
};

export const buildLineChartDataset = (
  buckets: Bucket[],
  label?: string,
  borderColor?: string
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  borderColor: borderColor ? borderColor : theme.palette.neutral[700],
  backgroundColor: theme.palette.neutral[0],
  labels: buckets.map((bucket) => bucket.key_as_string),
});
