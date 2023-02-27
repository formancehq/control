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

import { LineProps } from './types';

import ChartPlaceholder from '~/src/components/Dataviz/Charts/ChartPlaceholder';
import { ChartPlaceholderTypes } from '~/src/components/Dataviz/Charts/ChartPlaceholder/types';
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

const Line: FunctionComponent<LineProps> = ({ data, options, title }) => {
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return <ChartPlaceholder type={ChartPlaceholderTypes.LINE} title={title} />;
  }

  return (
    <>
      {title && (
        <Typography variant="h2" mb={1} mt={1}>
          {title}
        </Typography>
      )}
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
        <ChLine options={getChartOptions(options)} width="100%" data={data} />
      </Box>
    </>
  );
};

export default Line;
