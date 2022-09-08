import { ReactElement } from 'react';

import {
  LoadingButtonProps,
  ModalActionsProps,
  ModalProps as SbModalProps,
} from '@numaryhq/storybook';

export type ModalProps = {
  children: ReactElement;
  modal: Omit<SbModalProps, 'actions' | 'open'> & {
    actions?: {
      cancel?: {
        label: string;
        onClick: () => void;
      };
      save?: ModalActionsProps & {
        disabled?: boolean;
      };
    };
  };
  button: LoadingButtonProps;
};
