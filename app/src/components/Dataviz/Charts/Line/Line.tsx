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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line: FunctionComponent<LineProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Box
      sx={{
        p: 2,
        mr: 2,
        borderRadius: '6px',
        border: ({ palette }) => `1px solid ${palette.neutral[200]}`,
      }}
    >
      <ChLine options={options} data={data} />
    </Box>
  );
};

export default Line;
