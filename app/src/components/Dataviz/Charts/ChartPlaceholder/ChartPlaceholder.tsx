import React, { FunctionComponent, ReactElement } from 'react';

import { QueryStats } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ChartPlaceholderProps, ChartPlaceholderTypes } from './types';

import { LoadingButton, ObjectOf } from '@numaryhq/storybook';

import Line from '~/src/components/Dataviz/Charts/Line';
import Pie from '~/src/components/Dataviz/Charts/Pie';
import { Chart } from '~/src/types/chart';

const lineDataMock = {
  labels: ['11:00 PM', '1:00 PM', '2:00 PM', '4:00 PM', '8:00 PM', '9:00 PM'],
  datasets: [
    {
      data: [12, 7, 15, 6, 7, 2],
      borderColor: 'hsl(220,  10%, 20%)',
      backgroundColor: 'hsl(0, 0%, 100%)',
    },
  ],
};

const pieDataMock: Chart = {
  labels: ['PAY-IN', 'PAYOUT'],
  datasets: [
    {
      data: [4207, 2555],
      backgroundColor: ['hsl(209, 100%, 85%)', 'hsl(220, 14%, 90%)'],
      borderColor: ['hsl(0, 0%, 100%)', 'hsl(0, 0%, 100%)'],
      hoverBorderColor: 'hsl(0, 0%, 100%)',
      borderWidth: 2,
    },
  ],
};

const ChartPlaceholder: FunctionComponent<ChartPlaceholderProps> = ({
  type,
  title,
}) => {
  const { t } = useTranslation();
  const chartsMap = {
    [ChartPlaceholderTypes.LINE]: <Line data={lineDataMock} title={title} />,
    [ChartPlaceholderTypes.PIE]: <Pie data={pieDataMock} title={title} />,
  } as ObjectOf<ReactElement>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        p: 2,
        mt: 2,
        mb: 2,
        borderRadius: '6px',
        border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
      }}
    >
      <Box sx={{ opacity: '0.1', width: '100%' }}>{chartsMap[type]}</Box>
      <Box>
        <LoadingButton
          variant="stroke"
          content={t('common.noActivity')}
          endIcon={<QueryStats />}
        />
      </Box>
    </Box>
  );
};

export default ChartPlaceholder;
