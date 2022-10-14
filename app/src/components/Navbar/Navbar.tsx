import React, { FunctionComponent } from 'react';

import { ArrowDropDown } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import Search from './../Search';

import { Navbar as FormanceNavbar } from '@numaryhq/storybook';

import LinkWrapper from '../Wrappers/LinkWrapper';

import {
  getRoute,
  OVERVIEW_ROUTE,
  routerConfig,
} from '~/src/components/Navbar/routes';
import { useService } from '~/src/hooks/useService';

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentUser, metas } = useService();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();

    return window.location.replace(`${metas.origin}/auth/redirect-logout`);
  };

  const formattedRouterConfig = routerConfig.map((route) => ({
    ...route,
    label: t(route.label),
  }));

  const settings = [t('topbar.logout')];

  return (
    <FormanceNavbar
      onLogoClick={() => navigate(getRoute(OVERVIEW_ROUTE))}
      logo={<img src="/images/logo.svg" alt="logo" />}
      routes={formattedRouterConfig}
      location={location}
      linkWrapper={
        <LinkWrapper to={''} prefetch={'none'} color={''}>
          <Box />
        </LinkWrapper>
      }
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '120px',
        }}
      >
        <Search />
        {currentUser && currentUser.avatarLetter && (
          <>
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: theme.palette.green.bright,
                }}
              >
                {currentUser.avatarLetter}
              </Avatar>
            </IconButton>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <ArrowDropDown sx={{ color: theme.palette.grey[500] }} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
    </FormanceNavbar>
  );
};

export default Navbar;
