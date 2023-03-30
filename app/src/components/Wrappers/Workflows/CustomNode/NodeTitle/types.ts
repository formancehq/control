import { ReactElement } from 'react';

export type NodeTitleProps = {
  label: string;
  color?: string;
  onToggle?: () => void;
  icon: ReactElement;
};
