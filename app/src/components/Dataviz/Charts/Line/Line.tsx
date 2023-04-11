import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line as ChLine } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { LineProps } from './types';

import ChartPlaceholder from '~/src/components/Dataviz/Charts/ChartPlaceholder';
import { getChartOptions } from '~/src/components/Dataviz/Charts/utils';
import { subtitleSx, titleSx } from '~/src/components/Dataviz/utils';
import { ChartTypes } from '~/src/types/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line: FunctionComponent<LineProps> = ({
  data,
  options,
  title,
  height = 200,
  time = { value: '12', kind: 'hours' },
  sxTitle = titleSx,
  sxSubtitle = subtitleSx,
}) => {
  console.log(sxTitle);
  const { t } = useTranslation();
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return (
      <ChartPlaceholder type={ChartTypes.LINE} title={title} time={time} />
    );
  }

  return (
    <>
      {title && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2" mb={1} mt={1} sx={sxTitle}>
            {title}
          </Typography>
          <Typography mb={1} mt={1} sx={sxSubtitle}>
            {t('common.chart.last', { value: time.value, kind: time.kind })}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          p: 2,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '6px',
          border: ({ palette }) => `1px solid ${palette.neutral[200]}`,
        }}
      >
        <ChLine options={getChartOptions(options)} width="100%" data={data} />
      </Box>
    </>
  );
};

export default Line;
