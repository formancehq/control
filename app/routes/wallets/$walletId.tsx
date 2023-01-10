import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { Page, SectionWrapper } from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { Wallet } from '~/src/types/wallet';
import { API_WALLET } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Wallet',
  description: 'Show a wallet',
});

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.walletId, 'Expected params.walletId');
    const wallet = await (
      await createApiClient(session)
    ).getResource<Wallet[]>(`${API_WALLET}/wallets/${params.walletId}`, 'data');
    console.log(wallet);
    if (wallet) {
      return wallet;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="wallet"
      title="pages.wallet.title"
      error={error}
      showAction={false}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const wallet = useLoaderData<Wallet>() as unknown as Wallet;
  const { walletId: id } = useParams<{
    walletId: string;
  }>();
  console.log(wallet);

  return (
    <Page id="wallet" title={id}>
      <>
        <SectionWrapper title={t('pages.wallet.sections.balances.title')}>
          <div>bal</div>
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.holds.title')}>
          <div>holds</div>
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.transactions.title')}>
          <div>trans</div>
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.metadata.title')}>
          <div>meta</div>
        </SectionWrapper>
      </>
    </Page>
  );
}
