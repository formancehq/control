import * as React from 'react';
import { FunctionComponent, useState } from 'react';

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
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { get, isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Chip, Select } from '@numaryhq/storybook';

import { TopbarProps } from '~/src/components/Layout/components/Topbar/types';
import Search from '~/src/components/Search';
import { useService } from '~/src/hooks/useService';
import useSimpleMediaQuery from '~/src/hooks/useSimpleMediaQuery';
import { createReactApiClient } from '~/src/utils/api.client';
import {
  createFavoriteMetadata,
  getFavorites,
  updateUserMetadata,
} from '~/src/utils/membership';

const Topbar: FunctionComponent<TopbarProps> = ({ resized, onResize }) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const { isMobile } = useSimpleMediaQuery();
  const { currentUser, metas, abilities, snackbar } = useService();
  const { stacks } = currentUser;
  const stackUrl = get(getFavorites(currentUser), 'stackUrl');
  const [value, setValue] = useState<string>(stackUrl || '');
  const region =
    stacks &&
    get(
      stacks.find((stack) => stack.uri === value),
      'regionID'
    );

  const onChange = async (event: SelectChangeEvent<unknown>) => {
    if (typeof event.target.value === 'string') {
      const val = event.target.value;
      if (!isEmpty(val)) {
        setValue(val);
        const api = await createReactApiClient(metas.membership, true);
        const metadata = createFavoriteMetadata(val);
        try {
          await updateUserMetadata(api, metadata);
          window.location.href = metas.origin;
        } catch (e) {
          snackbar(t('common.feedback.error'));
        }
      }
    }
  };
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
        justifyContent:
          abilities && abilities.shouldRedirectToStackOnboarding
            ? 'end'
            : 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
      }}
      id="topbar"
    >
      {abilities && !abilities.shouldRedirectToStackOnboarding && (
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
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {abilities && !abilities.shouldRedirectToStackOnboarding && (
          <Box
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: ({ palette }) => palette.neutral[0],
              },
              '& .MuiSvgIcon-root': {
                color: ({ palette }) => palette.neutral[0],
              },
              '& .MuiInputBase-input': {
                color: ({ palette }) => palette.neutral[0],
              },
            }}
          >
            <Select
              items={
                (stacks &&
                  stacks.map((stack) => ({
                    id: stack.uri,
                    label: `${stack.name} ${stack.organizationId}-${stack.id}`,
                  }))) ||
                []
              }
              placeholder={t('common.filters.stacks')}
              select={{
                onChange,
                value,
              }}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex' }}>
          {region && (
            <Box mr={1}>
              <Chip label={region} variant="square" />
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
