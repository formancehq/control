import * as React from 'react';
import { FunctionComponent } from 'react';
import Navbar from '~/src/components/Navbar';
import { LayoutProps } from '~/src/components/Layout/types';
import { Breadcrumbs } from '@numaryhq/storybook';
import { useMatch, useParams } from 'react-router-dom';
import { useNavigate } from 'remix';
import { breadcrumbsFactory } from '~/src/components/Layout/service';

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const params = useParams();
  const navigate = useNavigate();
  const match = (pattern: string): boolean => !!useMatch(pattern);
  const links = breadcrumbsFactory(params, match, navigate);

  return (
    <>
      <Navbar />
      {links && <Breadcrumbs links={links} />}
      {children}
    </>
  );
};

export default Layout;
