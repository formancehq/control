import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie as ChPie } from 'react-chartjs-2';

import { PieProps } from './types';

import ChartPlaceholder from '~/src/components/Dataviz/Charts/ChartPlaceholder';
import { ChartPlaceholderTypes } from '~/src/components/Dataviz/Charts/ChartPlaceholder/types';
import { getChartOptions } from '~/src/components/Dataviz/Charts/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const Pie: FunctionComponent<PieProps> = ({ data, options, title }) => {
  if (data.datasets.length === 0 || data.labels.length === 0) {
    return <ChartPlaceholder type={ChartPlaceholderTypes.PIE} title={title} />;
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
    </>
  );
};

export default Pie;
