import React, { FunctionComponent } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, Row, SourceDestination } from '@numaryhq/storybook';

import { getLedgerAccountDetailsRoute } from '~/src/components/Layout/routes';
import { AccountListProps } from '~/src/components/Wrappers/Lists/AccountList/types';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import Table from '~/src/components/Wrappers/Table';
import { Account } from '~/src/types/ledger';

const AccountList: FunctionComponent<AccountListProps> = ({ accounts }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAction = (account: Account) =>
    navigate(getLedgerAccountDetailsRoute(account.address, account.ledger));

  return (
    <Table
      items={accounts}
      action
      columns={[
        {
          key: 'address',
          label: t('pages.accounts.table.columnLabel.address'),
          width: 40,
        },
        {
          key: 'ledger',
          label: t('pages.accounts.table.columnLabel.ledger'),
          width: 60,
        },
      ]}
      renderItem={(account: Account, index) => (
        <Row
          key={index}
          keys={[
            <SourceDestination
              ellipse={false}
              key={account.address}
              label={account.address}
              onClick={() => handleAction(account)}
            />,
            <Chip
              key={index}
              label={account.ledger}
              variant="square"
              color="brown"
            />,
          ]}
          item={account}
          renderActions={() => (
            <ShowListAction
              id={account.address}
              onClick={() => handleAction(account)}
            />
          )}
        />
      )}
    />
  );
};

export default AccountList;
