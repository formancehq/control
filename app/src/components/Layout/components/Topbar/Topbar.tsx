import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';

import { ArrowDropDown, MenuOpen, Person } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TopbarProps } from '~/src/components/Layout/components/Topbar/types';
import Search from '~/src/components/Search';
import { useService } from '~/src/hooks/useService';
import { CurrentUser } from '~/src/utils/api';

const Topbar: FunctionComponent<TopbarProps> = ({ resized, onResize }) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const { api, setCurrentUser, currentUser, metas } = useService();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const settings = [t('topbar.logout')];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    window.location.href = `${metas.origin}/auth/redirect-logout`;
  };

  const getCurrentUser = async () => {
    try {
      const user = await api.getResource<CurrentUser>(
        `${metas.openIdConfig.userinfo_endpoint.split('api')[1]}`
      );
      if (user) {
        const pseudo =
          user && user.email ? user.email.split('@')[0] : undefined;

        setCurrentUser({
          ...user,
          avatarLetter: pseudo ? pseudo.split('')[0].toUpperCase() : undefined,
          pseudo,
        });
      }
    } catch (e) {
      console.info('Current user could not be retrieved');
    }
  };

  useEffect(() => {
    (async () => {
      await getCurrentUser();
    })();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '40px',
        position: 'fixed',
        width: '100%',
        p: '8px 0 8px 0',
        borderRadius: '0 !important',
        background: palette.neutral[800],
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
      }}
      id="topbar"
    >
      <Box display="flex">
        <IconButton
          sx={{
            transition: 'all 0.85s',
            color: ({ palette }) => palette.neutral[500],
            background: 'transparent',
            ml: 2,
            mr: 2,
            ':hover': {
              transform: `rotate(${resized ? '-180deg' : '180deg'})`,
              color: ({ palette }) => palette.neutral[300],
              transition: 'all 0.85s',
              background: 'transparent',
            },
          }}
          onClick={onResize}
        >
          <MenuOpen />
        </IconButton>
        <Search />
      </Box>

      {currentUser && (
        <Box mr={1}>
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="User Avatar"
              sx={{
                width: 24,
                height: 24,
                padding: '1px',
                borderRadius: '4px',
                bgcolor: palette.red.bright,
              }}
            >
              {currentUser.avatarLetter ? (
                <Typography variant="bold">
                  {currentUser.avatarLetter}
                </Typography>
              ) : (
                <Person />
              )}
            </Avatar>
          </IconButton>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <ArrowDropDown sx={{ color: palette.neutral[500] }} />
          </IconButton>
          <MuiMenu
            sx={{
              mt: '45px',
              ul: {
                padding: '6px',
                margin: 0,
                background: palette.neutral[800],
                color: palette.neutral[0],
              },
            }}
            PaperProps={{
              sx: {
                boxShadow: 'none',
              },
            }}
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
              <MenuItem
                key={setting}
                onClick={handleLogout}
                sx={{
                  ':hover': {
                    background: palette.neutral[700],
                  },
                }}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </MuiMenu>
        </Box>
      )}
    </Box>
  );
};

export default Topbar;
