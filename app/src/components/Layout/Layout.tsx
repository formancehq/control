import * as React from 'react';
import { FunctionComponent } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams, useTransition } from '@remix-run/react';
import { useMatch, useParams } from 'react-router-dom';
import {
  animated,
  useTransition as useAnimationTransition,
} from 'react-spring';

import { Breadcrumbs } from '@numaryhq/storybook';

import Sidebar from '~/src/components/Layout/components/Sidebar';
import Topbar from '~/src/components/Layout/components/Topbar';
import { breadcrumbsFactory } from '~/src/components/Layout/service';
import { LayoutProps } from '~/src/components/Layout/types';

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const transition = useTransition();
  const resizedSidebar = localStorage.getItem('resizedSidebar') || 'false';
  const [showMiniSidebar, setShowMiniSidebar] = React.useState(
    JSON.parse(resizedSidebar)
  );
  const params = useParams();
  const navigate = useNavigate();
  const match = (pattern: string): boolean => !!useMatch(pattern);
  const [searchParams] = useSearchParams();
  const links = breadcrumbsFactory(params, match, navigate, searchParams);

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
              <Sidebar width={sideBarWidth} resized={showMiniSidebar} />
              <Box
                sx={{ width: { sm: `calc(100% - ${sideBarWidth}px)` } }}
                mt={8}
              >
                {links && <Breadcrumbs links={links} />}
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
