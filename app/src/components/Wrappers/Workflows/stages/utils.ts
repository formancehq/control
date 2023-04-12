export const containerSx = {
  textAlign: 'initial',
  display: 'block',
  fontSize: 10,
  '& .MuiChip-root': { fontSize: 8, padding: 0, height: 20 },
};
export const typoSx = { fontSize: '8px' };

export const chipContainer = {
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
};

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
