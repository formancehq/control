import { SxProps } from '@mui/system';
import i18next from 'i18next';
import { isEmpty } from 'lodash';

import { theme } from '@numaryhq/storybook';

export const containerSx = {
  textAlign: 'initial',
  display: 'block',
  fontSize: 10,
  '& .MuiChip-root': { fontSize: 8, padding: 0, height: 20 },
};
export const typoSx = { fontSize: '8px' };

export const chipContainer = (str?: string | number | undefined) => ({
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .MuiTypography-root': {
    fontSize: '8px',
  },
  '& .MuiSvgIcon-root': {
    width: '0.5em',
    height: '0.5em',
  },
  ...getPlaceholderChipSx(str),
});

export const jsonContainer = {
  ...chipContainer,
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  gap: 0,
  '& li': {
    fontSize: '8px !important',
  },
  '& .MuiBox-root': {
    width: 'calc(100% - 15px)',
  },
};

export const getPlaceholder = (str?: string | number | undefined): string => {
  if (str && !isEmpty(str) && str !== 'undefined') {
    return `${str}`;
  }

  return i18next.t('common.noData');
};

export const placeholderSx = { pr: 0.5 };

export const chipPlaceholderSx = {
  '& .MuiChip-root': {
    fontSize: '8px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    color: theme.palette.neutral[500],
    fontStyle: 'italic',
    background: 'transparent',
    '& .MuiChip-label': {
      pr: 0.5,
    },
  },
};

export const getPlaceholderChipSx = (
  str?: string | number | undefined
): undefined | SxProps => {
  if (str && !isEmpty(str) && str !== 'undefined') {
    return undefined;
  }

  return chipPlaceholderSx;
};
