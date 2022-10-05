import { Filters } from "~/src/components/Wrappers/Table/Filters/filters";

export type SelectProps = {
  id: string;
  options: string[] | [];
  field?: string;
  placeholder: string;
  width?: number;
  name: string;
  variant?: "light" | "dark";
  type?: Filters.TERMS | Filters.LEDGERS;
};
