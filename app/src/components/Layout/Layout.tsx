import * as React from 'react';
import { FunctionComponent } from 'react';

import { CircularProgress } from '@mui/material';
import { useSearchParams, useTransition, useNavigate } from '@remix-run/react';
import { useMatch, useParams } from 'react-router-dom';
import {
  useTransition as useAnimationTransition,
  animated,
} from 'react-spring';

import { Breadcrumbs, theme } from '@numaryhq/storybook';

import { breadcrumbsFactory } from '~/src/components/Layout/service';
import { LayoutProps } from '~/src/components/Layout/types';
import Navbar from '~/src/components/Navbar';

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const params = useParams();
  const navigate = useNavigate();
  const match = (pattern: string): boolean => !!useMatch(pattern);
  const [searchParams] = useSearchParams();
  const links = breadcrumbsFactory(params, match, navigate, searchParams);

  const transition = useTransition();

  const loadingTransition = useAnimationTransition(transition.state, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <>
      <Navbar />
      {links && <Breadcrumbs links={links} />}

      {loadingTransition((props, transitionState) =>
        transitionState === 'loading' ? (
          <animated.div
            style={{
              ...props,
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              background: theme.palette.neutral[0],
            }}
          >
            <CircularProgress size={30} />
          </animated.div>
        ) : (
          <animated.div style={props}>{children}</animated.div>
        )
      )}
    </>
  );
};

export default Layout;
