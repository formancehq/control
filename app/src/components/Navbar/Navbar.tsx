import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { isArray } from 'radash';
import { useLocation, useNavigate } from 'react-router-dom';
import { theme } from '@numaryhq/storybook';
import {
  getRoute,
  OVERVIEW_ROUTE,
  routerConfig,
} from '~/src/components/Navbar/routes';
import { useTranslation } from 'react-i18next';
import Search from './../Search';
import LinkWrapper from '../Wrappers/LinkWrapper';

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '0 !important',
          boxShadow: 'none',
        },
      }}
    >
      <AppBar
        position="static"
        sx={{
          margin: 0,
          border: 'none !important',
        }}
      >
        <Toolbar
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {/* TODO replace by logo*/}
            <Typography
              variant="h6"
              noWrap
              sx={{ cursor: 'pointer' }}
              component="div"
              onClick={() => navigate(getRoute(OVERVIEW_ROUTE))}
            >
              FORMANCE
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {routerConfig.map(({ label, path, id }) => {
              const selected = isArray(path)
                ? path[0] === location.pathname
                : path === location.pathname;

              return (
                <LinkWrapper
                  key={id}
                  prefetch="intent"
                  to={isArray(path) ? path[0] : (path as string)}
                  color={selected ? theme.palette.neutral[900] : 'inherit'}
                >
                  <Button
                    sx={{
                      gap: '8px',
                      padding: '8px 16px',
                      margin: '0px 4px 0px 4px',
                      height: '40px',
                      minWidth: '54px',
                      textTransform: 'none',
                      backgroundColor: ({ palette }) =>
                        selected ? palette.neutral[0] : palette.neutral[900],
                      color: ({ palette }) =>
                        selected ? palette.neutral[900] : 'inherit',
                      '&:hover': {
                        backgroundColor: ({ palette }) =>
                          selected ? palette.neutral[0] : palette.neutral[800],
                      },
                    }}
                  >
                    {t(label)}
                  </Button>
                </LinkWrapper>
              );
            })}
          </Box>
          <Search />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
