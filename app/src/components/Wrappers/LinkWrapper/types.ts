import { ReactElement } from 'react';

export type LinkWrapperProps = {
  to: string;
  prefetch: 'none' | 'intent' | 'render';
  children: ReactElement;
  color: string;
};
