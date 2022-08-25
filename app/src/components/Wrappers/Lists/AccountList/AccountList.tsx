import React, { FunctionComponent } from 'react';
import { Account } from '~/src/types/ledger';
import { useNavigate } from 'react-router-dom';
import { getLedgerAccountDetailsRoute } from '~/src/components/Navbar/routes';
import { Chip, Row, SourceDestination } from '@numaryhq/storybook';
import { AccountListProps } from '~/src/components/Wrappers/Lists/AccountList/types';
import { useTranslation } from 'react-i18next';
import Table from '~/src/components/Wrappers/Table';

const AccountList: FunctionComponent<AccountListProps> = ({ accounts }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAction = (account: Account) =>
    navigate(getLedgerAccountDetailsRoute(account.address, account.ledger));

  return (
    <Table
      items={accounts}
      columns={[
        {
          key: 'address',
          label: t('pages.accounts.table.columnLabel.address'),
        },
        {
          key: 'ledger',
          label: t('pages.accounts.table.columnLabel.ledger'),
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
        />
      )}
    />
  );
};

export default AccountList;
