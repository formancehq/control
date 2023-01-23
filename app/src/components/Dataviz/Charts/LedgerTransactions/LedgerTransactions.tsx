import * as React from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export const LedgerTransactions = (data: { buckets: string[] }) => (
  <Bar
    options={{
      font: {
        family: 'Roboto Mono',
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    }}
    data={{
      labels: ['01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18'],
      datasets: [
        {
          label: 'main-ledger',
          data: [124, 1101, 327, 532, 123, 981, 1622],
          backgroundColor: 'hsl(220, 13%, 92%)',
        },
        {
          label: 'secondary-ledger',
          data: [124, 1101, 327, 532, 123, 981, 1622],
          backgroundColor: 'hsl(220, 13%, 13%)',
        },
      ],
    }}
  />
);
