import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
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

import { LineProps } from './types';

import { getChartOptions } from '~/src/components/Dataviz/Charts/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line: FunctionComponent<LineProps> = ({ data, options }) => {
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        height: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '6px',
        border: ({ palette }) => `1px solid ${palette.neutral[200]}`,
      }}
    >
      <ChLine options={getChartOptions(options)} data={data} />
    </Box>
  );
};

export default Line;
