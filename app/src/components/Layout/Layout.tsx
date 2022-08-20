import * as React from 'react';
import { FunctionComponent } from 'react';
import Navbar from '~/src/components/Navbar';
import { LayoutProps } from '~/src/components/Layout/types';
import { Breadcrumbs } from '@numaryhq/storybook';
import { useMatch, useParams } from 'react-router-dom';

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const params = useParams();
  const target = params.accountId ? 'accounts' : 'transactions';
  const ledgerRoute = useMatch(`/ledgers/:ledgerId/${target}/:${target}Id`);
  // todo handle new breadcrumb
  const links = [] as any;

  return (
    <>
      <Navbar />
      {ledgerRoute && <Breadcrumbs links={links} />}
      {children}
    </>
  );
};

export default Layout;
