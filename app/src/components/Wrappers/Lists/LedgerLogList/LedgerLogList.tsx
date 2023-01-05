import React, { FunctionComponent } from 'react';

import { truncate } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  Chip,
  CopyPasteTooltip,
  Date,
  JsonViewer,
  ObjectOf,
  Row,
} from '@numaryhq/storybook';

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
          key: 'data',
          label: t('pages.ledger.logs.table.columnLabel.data'),
          width: 90,
        },
        {
          key: 'hash',
          label: t('pages.ledger.logs.table.columnLabel.hash'),
          width: 5,
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
            <JsonViewer key={index} jsonData={log.data} expanded={false} />,
            <CopyPasteTooltip
              key={index}
              tooltipMessage={t('common.tooltip.copied')}
              value={log.hash}
            >
              <Chip
                key={index}
                label={truncate(log.hash, { length: 24 })}
                variant="square"
                color="blue"
              />
            </CopyPasteTooltip>,
          ]}
          item={log}
        />
      )}
    />
  );
};

export default LedgerLogList;
