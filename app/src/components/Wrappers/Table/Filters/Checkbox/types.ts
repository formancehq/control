export type CheckboxProps = {
  name: string;
  label?: string;
  value: string;
  onChange?: () => void;
};

export type CheckboxItem = {
  id: string;
  label: string;
};
