import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, CopyPasteTooltip, Date, Page, Row } from '@numaryhq/storybook';

import {
  getRoute,
  WALLET_ROUTE,
  wallets as walletsConfig,
} from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import Table from '~/src/components/Wrappers/Table';
import { FEATURES } from '~/src/contexts/service';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
import { Cursor } from '~/src/types/generic';
import { Wallet } from '~/src/types/wallet';
import { API_WALLET } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { QueryContexts, sanitizeQuery } from '~/src/utils/search';

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'List',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={walletsConfig.id}
      title="pages.wallets.title"
      error={error}
    />
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(session);
    const query = sanitizeQuery(request, QueryContexts.PARAMS);
    const url = `${API_WALLET}/wallets?${query}`;

    return await api.getResource<Cursor<Wallet>>(url, 'cursor');
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const wallets = useLoaderData<string[]>();
  const navigate = useNavigate();
  useFeatureFlag(FEATURES.WALLETS);

  return (
    <Page id={walletsConfig.id}>
      <Table
        id="wallet-list"
        items={wallets}
        action={true}
        columns={[
          {
            key: 'id',
            label: t('pages.wallets.table.columnLabel.id'),
            width: 40,
          },
          {
            key: 'name',
            label: t('pages.wallets.table.columnLabel.name'),
            width: 50,
          },
          {
            key: 'createdAt',
            label: t('pages.wallets.table.columnLabel.createdAt'),
            width: 10,
          },
        ]}
        renderItem={(wallet: Wallet, index: number) => (
          <Row
            key={index}
            keys={[
              <CopyPasteTooltip
                key={index}
                tooltipMessage={t('common.tooltip.copied')}
                value={wallet.id}
              >
                <Chip key={index} label={wallet.id} variant="square" />
              </CopyPasteTooltip>,
              'name',
              <Date key={index} timestamp={wallet.createdAt} />,
            ]}
            item={wallet}
            renderActions={() => (
              <ShowListAction
                id={wallet.id}
                onClick={() => navigate(`${getRoute(WALLET_ROUTE, wallet.id)}`)}
              />
            )}
          />
        )}
      />
    </Page>
  );
}
