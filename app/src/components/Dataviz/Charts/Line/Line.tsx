import React, { FunctionComponent } from 'react';

import { Box, useTheme } from '@mui/material';
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

const Line: FunctionComponent<LineProps> = () => {
  const { palette } = useTheme();
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

  const labels = ['January', 'February', 'March'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 22, 66],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: palette.neutral[0],
      },
      {
        label: 'Dataset 2',
        data: [55, 15, 78],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: palette.neutral[0],
      },
    ],
  };

  return (
    <Box>
      <ChLine options={options} data={data} />
    </Box>
  );
};

export default Line;
