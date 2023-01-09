import { Theme, useMediaQuery } from '@mui/material';

export default function useSimpleMediaQuery() {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between('sm', 'lg')
  );
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return {
    isMobile,
    isDesktop,
    isTablet,
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
}
