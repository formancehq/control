import React, { FunctionComponent, useEffect, useState } from 'react';
import { Account } from '~/src/types/ledger';
import { Cursor } from '~/src/types/generic';
import { useNavigate } from 'react-router-dom';
import { getLedgerAccountDetailsRoute } from '~/src/components/Navbar/routes';
import { useSearchParams } from '@remix-run/react';
import { API_SEARCH } from '~/src/utils/api';
import { Row, SourceDestination } from '@numaryhq/storybook';
import { buildQuery } from '~/src/utils/search';
import { SearchTargets } from '~/src/types/search';
import { AccountListProps } from '~/src/components/Wrappers/Lists/AccountList/types';
import { useService } from '~/src/hooks/useService';
import { useTranslation } from 'react-i18next';
import Table from '~/src/components/Wrappers/Table';

const AccountList: FunctionComponent<AccountListProps> = ({
  currentLedger,
}) => {
  const [searchParams] = useSearchParams();
  const [accounts, setAccounts] = useState<Cursor<Account>>();
  const navigate = useNavigate();
  const { api } = useService();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const load = await api.postResource<Cursor<Account>>(
        API_SEARCH,
        { ...buildQuery(searchParams), target: SearchTargets.ACCOUNT },
        'cursor'
      );
      if (load) {
        setAccounts(load);
      }
    })();
  }, [searchParams]);

  const renderAddress = (account: Account) => (
    <SourceDestination
      key={account.address}
      label={account.address}
      onClick={() => handleAction(account)}
    />
  );

  const handleAction = (account: Account) =>
    navigate(getLedgerAccountDetailsRoute(account.address, currentLedger));

  return (
    <Table
      items={accounts}
      columns={[
        {
          key: 'address',
          label: t('pages.ledgers.accounts.table.columnLabel.address'),
        },
      ]}
      renderItem={(account: Account, index) => (
        <Row key={index} keys={[renderAddress]} item={account} />
      )}
    />
  );
};

export default AccountList;
