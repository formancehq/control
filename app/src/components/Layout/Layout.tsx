import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';

import { ArrowDropDown, Menu, Person } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, useSearchParams, useTransition } from '@remix-run/react';
import { isArray } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useMatch, useParams } from 'react-router-dom';
import {
  animated,
  useTransition as useAnimationTransition,
} from 'react-spring';

import { Breadcrumbs, LoadingButton } from '@numaryhq/storybook';

import { breadcrumbsFactory } from '~/src/components/Layout/service';
import { LayoutProps } from '~/src/components/Layout/types';
import { routerConfig } from '~/src/components/Navbar/routes';
import Search from '~/src/components/Search';
import LinkWrapper from '~/src/components/Wrappers/LinkWrapper';
import { useService } from '~/src/hooks/useService';
import { CurrentUser } from '~/src/utils/api';

const drawerWidth = 250;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children: React.ReactNode;
}

function ResponsiveDrawer(props: Props) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const { palette } = useTheme();
  const { api, setCurrentUser, currentUser, metas } = useService();
  const params = useParams();
  const navigate = useNavigate();
  const match = (pattern: string): boolean => !!useMatch(pattern);
  const [searchParams] = useSearchParams();
  const links = breadcrumbsFactory(params, match, navigate, searchParams);
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
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ '& img': { width: '60px', ml: '24px', mb: 1 } }}>
        <Box display="flex" alignItems="center" alignSelf="center">
          <img src="/images/logoYellow.svg" alt="logo" />
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
            FORMANCE
          </Typography>
        </Box>
      </Toolbar>
      <Box>
        {routerConfig.map(({ label: groupLabel, children }, index) => (
          <React.Fragment key={index}>
            {groupLabel && (
              <Box mt={index === 1 ? 1 : 3} p={1} ml={3}>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    color: palette.neutral[400],
                  }}
                >
                  {t(groupLabel)}
                </Typography>
              </Box>
            )}

            {children.map(({ label, path, id, icon }) => {
              const selected = isArray(path)
                ? path.includes(location.pathname)
                : path === location.pathname;

              return (
                <Box
                  key={id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: '24px',
                  }}
                >
                  <LinkWrapper
                    to={isArray(path) ? (path[0] as string) : (path as string)}
                    prefetch="intent"
                    key={id}
                    color={selected ? palette.neutral[800] : 'inherit'}
                  >
                    <Button
                      sx={{
                        width: 200,
                        m: '4px 0 4px 0',
                        p: '10px 10px 10px 14px',
                        color: selected
                          ? palette.neutral[800]
                          : palette.neutral[500],
                        display: 'flex',
                        borderRadius: '6px',
                        justifyContent: 'start',
                        textTransform: 'none',
                        ':hover': {
                          p: '10px 10px 10px 14px',
                          color: palette.neutral[800],
                        },
                      }}
                      startIcon={icon}
                    >
                      {t(label)}
                    </Button>
                  </LinkWrapper>
                  {selected && (
                    <Box
                      component="span"
                      sx={{
                        borderLeft: `6px solid ${palette.yellow.bright}`,
                        borderRadius: '6px',
                        width: 4,
                        height: 40,
                        position: 'relative',
                        right: '-4px',
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </div>
  );

  const muiDrawerStyle = {
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      boxShadow: 'none',
      border: '0px !important',
      borderRight: `2px solid ${palette.neutral[100]} !important`,
      borderRadius: '0 !important',
      background: palette.neutral[0],
    },
  };

  const container = window.document.body;

  return (
    <Box
      sx={{
        display: 'flex',
        '& .MuiToolbar-root': {
          minHeight: '40px',
          p: '8px 0 8px 0',
        },
      }}
    >
      {/* TOPBAR */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          border: '0 !important',
          borderRadius: '0 !important',
          background: palette.neutral[0],
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            alignSelf="center"
          >
            <LoadingButton
              startIcon={<Menu />}
              onClick={handleDrawerToggle}
              variant="transparent"
              sx={{ mr: 2 }}
            />
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
        </Toolbar>
      </AppBar>

      {/* SIDEBAR*/}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            ...muiDrawerStyle,
          }}
        >
          {drawer}
        </Drawer>

        {/* desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            ...muiDrawerStyle,
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 2,
        }}
      >
        <Toolbar />
        {links && <Breadcrumbs links={links} />}
        {props.children}
      </Box>
    </Box>
  );
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const transition = useTransition();

  const loadingTransition = useAnimationTransition(transition.state, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <>
      {loadingTransition((props, transitionState) =>
        transitionState === 'loading' ? (
          <animated.div
            style={{
              ...props,
              position: 'absolute',
              top: '50%',
              left: '50%',
            }}
          >
            <CircularProgress size={30} />
          </animated.div>
        ) : (
          <animated.div style={props}>
            <ResponsiveDrawer>{children}</ResponsiveDrawer>
          </animated.div>
        )
      )}
    </>
  );
};

export default Layout;
