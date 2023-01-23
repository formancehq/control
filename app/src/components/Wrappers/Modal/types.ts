import { ReactElement } from 'react';

import {
  ButtonVariants,
  LoadingButtonProps,
  ModalActionsProps,
  ModalProps as SbModalProps,
} from '@numaryhq/storybook';

export type ModalProps = {
  children: ReactElement;
  modal: Omit<SbModalProps, 'actions' | 'open'> & {
    actions?: {
      cancel?: {
        label?: string;
        onClick?: () => Promise<any>;
        variant?: ButtonVariants;
      };
      save?: Omit<ModalActionsProps, 'label' | 'onClick'> & {
        disabled?: boolean;
        label?: string;
        onClick?: () => Promise<any>;
        variant?: ButtonVariants;
      };
    };
  };
  button: LoadingButtonProps;
};
