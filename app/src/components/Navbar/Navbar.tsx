import {
  AppBar,
  Box,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { isArray } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { routerConfig } from '~/src/components/Navbar/routes';
import { useTranslation } from 'react-i18next';
import SearchBar from '~/src/components/Wrappers/Search/SearchBar';

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Box sx={{ height: '80px' }}>
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
            <Typography variant="h6" noWrap component="div">
              FORMANCE
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            {routerConfig.map(({ label, path, id }) => {
              const selected = isArray(path)
                ? path[0] === location.pathname
                : path === location.pathname;

              return (
                <ListItemButton
                  key={id}
                  onClick={() =>
                    navigate(
                      isArray(path) ? (path[0] as string) : (path as string),
                      { replace: true }
                    )
                  }
                  sx={{
                    gap: '8px',
                    padding: '8px 16px',
                    height: '40px',
                    minWidth: '54px',
                    backgroundColor: ({ palette }) =>
                      selected ? palette.neutral[0] : 'inherit',
                    color: ({ palette }) =>
                      selected ? palette.neutral[900] : 'inherit',
                    '&:hover': {
                      backgroundColor: ({ palette }) =>
                        selected ? palette.neutral[0] : palette.neutral[800],
                    },
                  }}
                >
                  <ListItemText primary={t(label)} />
                </ListItemButton>
              );
            })}
          </Box>
          <SearchBar />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
