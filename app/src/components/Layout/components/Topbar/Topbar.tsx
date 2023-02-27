import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import {
  ArrowDropDown,
  HelpOutline,
  MenuOpen,
  Person,
} from '@mui/icons-material';
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
import useSimpleMediaQuery from '~/src/hooks/useSimpleMediaQuery';
import { CurrentUser } from '~/src/utils/api';
import { ReactApiClient } from '~/src/utils/api.client';

const Topbar: FunctionComponent<TopbarProps> = ({ resized, onResize }) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const { isMobile } = useSimpleMediaQuery();
  const [region, setRegion] = useState<string>();
  const { api, setCurrentUser, currentUser, metas } = useService();
  console.log(metas);
  const isSandbox = metas.api.split('staging').length > 0;
  console.log(isSandbox);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElHelp, setAnchorElHelp] = React.useState<null | HTMLElement>(
    null
  );
  const settings = [t('topbar.logout')];
  const helps = [
    {
      label: t('topbar.help.slack'),
      onClick: () => window.open('https://formance-community.slack.com'),
    },
    {
      label: t('topbar.help.docs'),
      onClick: () => window.open('https://docs.formance.com/'),
    },
  ];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setAnchorElHelp(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenHelpMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElHelp(event.currentTarget);
    setAnchorElUser(null);
  };

  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
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
      const client = new ReactApiClient();
      client.setBaseUrl && client.setBaseUrl(metas.api);
      const region = await client.getResource<string>('/versions', 'region');
      if (region) {
        setRegion(region);
      }
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
      <Box display="flex" ml={isMobile ? 3 : 0}>
        {!isMobile && (
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
        )}
        <Search />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex' }}>
          {region && (
            <Box>
              <Typography
                variant="bold"
                sx={{
                  color: !isSandbox
                    ? palette.neutral[200]
                    : palette.yellow.normal,
                  p: '4px 6px',
                  border: '1px solid',
                  borderRadius: 2,
                  mr: 2,
                }}
              >
                {region}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 1,
            }}
          >
            <IconButton sx={{ p: 0 }}>
              <HelpOutline color="secondary" />
            </IconButton>
            <IconButton onClick={handleOpenHelpMenu} sx={{ p: 0 }}>
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
              id="menu-help"
              anchorEl={anchorElHelp}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElHelp)}
              onClose={handleCloseHelpMenu}
            >
              {helps.map(({ onClick, label }) => (
                <MenuItem
                  key={label}
                  onClick={onClick}
                  sx={{
                    ':hover': {
                      background: palette.neutral[700],
                    },
                  }}
                >
                  <Typography textAlign="center">{label}</Typography>
                </MenuItem>
              ))}
            </MuiMenu>
          </Box>
        </Box>
        {currentUser && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 1,
            }}
          >
            <Box>
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  sx={{
                    width: 24,
                    height: 24,
                    padding: '1px',
                    borderRadius: '4px',
                    bgcolor: palette.neutral[700],
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
                id="menu-user"
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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
