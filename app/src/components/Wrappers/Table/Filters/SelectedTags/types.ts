import { Filters } from "~/src/components/Wrappers/Table/Filters/filters";

export type SelectedTagsProps = {
  name: Filters.TERMS | Filters.LEDGERS;
  field?: string;
};
