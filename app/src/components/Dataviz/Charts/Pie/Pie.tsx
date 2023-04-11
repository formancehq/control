import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie as ChPie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { PieProps } from './types';

import ChartPlaceholder from '~/src/components/Dataviz/Charts/ChartPlaceholder';
import { getChartOptions } from '~/src/components/Dataviz/Charts/utils';
import { subtitleSx, titleSx } from '~/src/components/Dataviz/utils';
import { ChartTypes } from '~/src/types/chart';

ChartJS.register(ArcElement, Tooltip, Legend);

const Pie: FunctionComponent<PieProps> = ({
  data,
  options,
  title,
  height = 200,
  time = { value: '12', kind: 'hours' },
  sxTitle = titleSx,
  sxSubtitle = subtitleSx,
}) => {
  const { t } = useTranslation();

  if (data.datasets.length === 0 || data.labels.length === 0) {
    return <ChartPlaceholder type={ChartTypes.PIE} title={title} time={time} />;
  }

  return (
    <>
      {title && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2" mb={1} mt={1} sx={sxTitle}>
            {title}
          </Typography>
          <Typography variant="h2" mb={1} mt={1} sx={sxSubtitle}>
            {t('common.chart.last', { value: time.value, kind: time.kind })}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          height,
          borderRadius: '6px',
          border: ({ palette }) => `1px solid ${palette.neutral[200]}`,
        }}
      >
        <ChPie options={getChartOptions(options)} data={data} />
      </Box>
    </>
  );
};

export default Pie;
