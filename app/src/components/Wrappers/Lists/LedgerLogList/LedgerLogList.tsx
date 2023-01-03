import React, { FunctionComponent } from 'react';

import { useTranslation } from 'react-i18next';

import { Chip, Date, JsonViewer, ObjectOf, Row } from '@numaryhq/storybook';

import { LedgerLogListProps } from '~/src/components/Wrappers/Lists/LedgerLogList/types';
import Table from '~/src/components/Wrappers/Table';
import { LedgerLog, Transaction } from '~/src/types/ledger';

const LedgerLogList: FunctionComponent<LedgerLogListProps> = ({
  logs,
  withPagination = true,
}) => {
  const { t } = useTranslation();

  return (
    <Table
      withPagination={withPagination}
      id="ledger-logs-list"
      items={logs}
      columns={[
        {
          key: 'type',
          label: t('pages.ledger.logs.table.columnLabel.type'),
          width: 10,
        },
        {
          key: 'date',
          label: t('pages.ledger.logs.table.columnLabel.date'),
          width: 5,
        },
        {
          key: 'hash',
          label: t('pages.ledger.logs.table.columnLabel.hash'),
          width: 5,
        },
        {
          key: 'data',
          label: t('pages.ledger.logs.table.columnLabel.data'),
          width: 90,
        },
      ]}
      renderItem={(
        log: LedgerLog<Transaction | ObjectOf<any>>,
        index: number
      ) => (
        <Row
          key={index}
          keys={[
            <Chip
              key={index}
              label={log.type}
              variant="square"
              color="yellow"
            />,
            <Date key={index} timestamp={log.date} />,
            <Chip key={index} label={log.hash} variant="square" color="blue" />,
            <JsonViewer key={index} jsonData={log.data} expanded={false} />,
          ]}
          item={log}
        />
      )}
    />
  );
};

export default LedgerLogList;
