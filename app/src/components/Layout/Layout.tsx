import * as React from 'react';
import { FunctionComponent } from 'react';
import Navbar from '~/src/components/Navbar';
import { LayoutProps } from '~/src/components/Layout/types';
import { Breadcrumbs } from '@numaryhq/storybook';
import { useMatch, useParams } from 'react-router-dom';
import { getRoute, LEDGERS_ROUTE } from '~/src/components/Navbar/routes';
import { useNavigate } from 'remix';

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const params = useParams();
  const target = params.accountId ? 'accounts' : 'transactions';
  const ledgerRoute = useMatch(`/ledgers/:ledgerId/${target}/:${target}Id`);
  const navigate = useNavigate();
  const links = [
    {
      label: `${target[0].toUpperCase()}${target.slice(1)}`,
      onClick: () => {
        navigate(getRoute(LEDGERS_ROUTE));
      },
    },
    {
      label: params.accountId ? params.accountId : params.transactionId,
    },
  ] as any;

  return (
    <>
      <Navbar />
      {ledgerRoute && <Breadcrumbs links={links} />}
      {children}
    </>
  );
};

export default Layout;
