import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie as ChPie } from 'react-chartjs-2';

import { PieProps } from './types';

import { getChartOptions } from '~/src/components/Dataviz/Charts/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const Pie: FunctionComponent<PieProps> = ({ data, options }) => {
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        height: 300,
        borderRadius: '6px',
        border: ({ palette }) => `1px solid ${palette.neutral[200]}`,
      }}
    >
      <ChPie options={getChartOptions(options)} data={data} />
    </Box>
  );
};

export default Pie;
