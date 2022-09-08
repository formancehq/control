import React, { FunctionComponent } from 'react';

import { Download } from '@mui/icons-material';
import { Box, Palette } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, Date, LoadingButton, Row } from '@numaryhq/storybook';

import { ReportListProps } from '~/src/components/Wrappers/Lists/ReportList/types';
import Table from '~/src/components/Wrappers/Table';
import { Report, Status, Statuses } from '~/src/types/report';

const ReportList: FunctionComponent<ReportListProps> = ({ reports }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getStatusColor = (palette: Palette, status: Status): string => {
    const colorsMap = {
      [Statuses.SUCCEEDED]: palette.success.main,
      [Statuses.ERROR]: palette.error.main,
      [Statuses.PENDING]: palette.primary.main,
    };

    return colorsMap[status];
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
      items={reports}
      action
      columns={[
        {
          key: 'name',
          label: t('pages.reports.table.columnLabel.name'),
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
            <Chip variant="square" key={report._id} label={report.extension} />,
            <Date key={report._id} timestamp={report.createdAt} />,
            <Chip
              variant="outlined"
              sx={{
                border: 'solid 2px',
                borderColor: ({ palette }) =>
                  getStatusColor(palette, report.status),
                color: ({ palette }) => getStatusColor(palette, report.status),
                fontWeight: 500,
              }}
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
