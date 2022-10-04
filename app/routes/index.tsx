import * as React from 'react';
import { useEffect } from 'react';

import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from 'react-router-dom';

import { ACCOUNTS_ROUTE, getRoute } from '~/src/components/Navbar/routes';

export const meta: MetaFunction = () => ({
  title: 'Home',
  description: 'Home',
});

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(getRoute(ACCOUNTS_ROUTE));
  }, []);

  return <></>;
}
