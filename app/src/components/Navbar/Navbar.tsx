import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
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

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const formattedRouterconfig = routerConfig.map((route) => ({
    ...route,
    label: t(route.label),
  }));

  return (
    <FormanceNavbar
      onLogoClick={() => navigate(getRoute(OVERVIEW_ROUTE))}
      logo={<img src="/images/logo.svg" alt="logo" />}
      routes={formattedRouterconfig}
      location={location}
      linkWrapper={
        <LinkWrapper to={''} prefetch={'none'} color={''}>
          <Box />
        </LinkWrapper>
      }
    >
      <Search />
    </FormanceNavbar>
  );
};

export default Navbar;
