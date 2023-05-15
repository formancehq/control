import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import { Menu } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  MenuItem,
} from '@mui/material';
import { useNavigate, useSearchParams, useTransition } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useMatch, useParams } from 'react-router-dom';
import {
  animated,
  useTransition as useAnimationTransition,
} from 'react-spring';

import { Breadcrumbs } from '@numaryhq/storybook';

import Sidebar from '~/src/components/Layout/components/Sidebar';
import Topbar from '~/src/components/Layout/components/Topbar';
import { routerConfig } from '~/src/components/Layout/routes';
import { breadcrumbsFactory } from '~/src/components/Layout/service';
import { LayoutProps } from '~/src/components/Layout/types';
import { useService } from '~/src/hooks/useService';
import useSimpleMediaQuery from '~/src/hooks/useSimpleMediaQuery';

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const transition = useTransition();
  const [showMiniSidebar, setShowMiniSidebar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const match = (pattern: string): boolean => !!useMatch(pattern);
  const [searchParams] = useSearchParams();
  const links = breadcrumbsFactory(params, match, navigate, searchParams);
  const { isMobile } = useSimpleMediaQuery();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const { abilities } = useService();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path: string) => {
    setAnchorEl(null);
    navigate(path);
  };
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      const resizedSidebar = localStorage.getItem('resizedSidebar') || 'false';
      setShowMiniSidebar(JSON.parse(resizedSidebar));
      setShowSidebar(true);
    }
  }, [isMobile]);

  const handleMiniSidebar = () => {
    setShowMiniSidebar(!showMiniSidebar);
    localStorage.setItem('resizedSidebar', `${!showMiniSidebar}`);
  };

  const loadingTransition = useAnimationTransition(transition.state, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const sideBarWidth = showMiniSidebar ? 80 : 250;
  const va =
    abilities && abilities.shouldRedirectToStackOnboarding
      ? {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {};

  return (
    <Box sx={{ height: '100%' }}>
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
          <animated.div style={{ height: '100%' }}>
            <Topbar resized={showMiniSidebar} onResize={handleMiniSidebar} />
            <Box id="layout" sx={{ minHeight: '100%', display: 'flex' }}>
              {showSidebar &&
                abilities &&
                !abilities.shouldRedirectToStackOnboarding && (
                  <Sidebar width={sideBarWidth} resized={showMiniSidebar} />
                )}
              <Box
                sx={{
                  width: {
                    sm:
                      abilities && abilities.shouldRedirectToStackOnboarding
                        ? '100%'
                        : `calc(100% - ${sideBarWidth}px)`,
                  },
                  ...va,
                }}
                mt={8}
              >
                {!showSidebar && (
                  <>
                    <Button
                      startIcon={<Menu />}
                      id="responsive-burger"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{
                        ml: 1,
                        ':hover': {
                          background: 'none',
                        },
                      }}
                    />
                    <MuiMenu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'responsive-burger',
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          width: '100%',
                          boxShadow: 'none',
                          border: 0,
                        },
                      }}
                    >
                      {routerConfig.map(({ children }) =>
                        children.map(({ label, paths, id, icon }) => (
                          <MenuItem
                            key={id}
                            onClick={() => handleClose(paths[0])}
                          >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText>{t(label)}</ListItemText>
                          </MenuItem>
                        ))
                      )}
                    </MuiMenu>
                  </>
                )}
                {links && !abilities.shouldRedirectToStackOnboarding && (
                  <Breadcrumbs links={links} />
                )}
                {children}
              </Box>
            </Box>
          </animated.div>
        )
      )}
    </Box>
  );
};

export default Layout;
