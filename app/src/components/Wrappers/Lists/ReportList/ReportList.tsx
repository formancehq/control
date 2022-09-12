import React, { FunctionComponent } from 'react';

import { Download } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ColorVariants } from '@numaryhq/storybook/dist/cjs/types/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, Date, LoadingButton, Row } from '@numaryhq/storybook';

import { ReportListProps } from '~/src/components/Wrappers/Lists/ReportList/types';
import Table from '~/src/components/Wrappers/Table';
import { Report, Status, Statuses } from '~/src/types/report';

const ReportList: FunctionComponent<ReportListProps> = ({ reports }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getStatusColor = (status: Status): ColorVariants => {
    const colorsMap = {
      [Statuses.SUCCEEDED]: 'green',
      [Statuses.ERROR]: 'red',
      [Statuses.PENDING]: 'blue',
    };

    return colorsMap[status] as ColorVariants;
  };

  const renderRowActions = (report: Report) => (
    <Box key={report._id} component="span">
      <LoadingButton
        id={`download-${report._id}`}
        onClick={() => console.log('download')}
        endIcon={<Download />}
      />
    </Box>
  );

  return (
    <Table
      withPagination={false}
      items={reports}
      action
      columns={[
        {
          key: 'name',
          label: t('pages.reports.table.columnLabel.name'),
        },
        {
          key: 'ledger',
          label: t('common.table.ledger.columnLabel'),
        },
        {
          key: 'extension',
          label: t('pages.reports.table.columnLabel.extension'),
        },
        {
          key: 'createdAt',
          label: t('pages.reports.table.columnLabel.createdAt'),
        },
        {
          key: 'status',
          label: t('pages.reports.table.columnLabel.status'),
        },
      ]}
      renderItem={(report: Report, index) => (
        <Row
          key={index}
          keys={[
            'name',
            <Chip
              key={index}
              label={report.ledger}
              variant="square"
              color="brown"
            />,
            <Chip variant="square" key={report._id} label={report.extension} />,
            <Date key={report._id} timestamp={report.createdAt} />,
            <Chip
              variant="square"
              color={getStatusColor(report.status)}
              key={report._id}
              label={report.status} // todo handle trans
            />,
          ]}
          item={report}
          renderActions={() => renderRowActions(report)}
        />
      )}
    />
  );
};

export default ReportList;
