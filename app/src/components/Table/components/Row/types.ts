import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { ReactElement } from 'react';

export type RowProps = {
  keys: Array<string | ((item: any) => void) | null | ReactElement>;
  item: any;
  id?: string;
  renderActions?: () => void;
  sx?: SxProps<Theme>;
};
