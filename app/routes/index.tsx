import * as React from 'react';
import { useEffect } from 'react';

import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from 'react-router-dom';

import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';

export const meta: MetaFunction = () => ({
  title: 'Home',
  description: 'Home',
});

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(getRoute(OVERVIEW_ROUTE));
  }, []);

  return <></>;
}
