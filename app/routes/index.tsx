import * as React from 'react';
import { useEffect } from 'react';
import type { MetaFunction } from 'remix';
import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import { useNavigate } from 'react-router-dom';

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
