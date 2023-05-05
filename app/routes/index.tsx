import * as React from 'react';
import { useEffect } from 'react';

import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from 'react-router-dom';

import {
  OVERVIEW_ROUTE,
  STACK_CREATE_ROUTE,
} from '~/src/components/Layout/routes';
import { useService } from '~/src/hooks/useService';

export const meta: MetaFunction = () => ({
  title: 'Home',
  description: 'Home',
});

export default function Index() {
  const navigate = useNavigate();
  const { metas } = useService();

  useEffect(() => {
    if (metas.shouldRedirectToStackOnboarding) {
      navigate(STACK_CREATE_ROUTE);
    } else {
      navigate(OVERVIEW_ROUTE);
    }
  }, []);

  return <></>;
}
