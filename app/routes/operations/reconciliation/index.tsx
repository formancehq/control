import * as React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { LoaderFunction } from '@remix-run/node';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useLoaderData } from 'remix';

import { Page } from '@numaryhq/storybook';

import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import { Cursor } from '~/src/types/generic';
import { Payment } from '~/src/types/payment';
import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';
import { API_SEARCH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { sanitizeQuery } from '~/src/utils/search';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const loader: LoaderFunction = async ({ request }) => {
  const res = await withSession(request, async (session) => {
    const api = await createApiClient(session);

    const payments = await api.postResource<Cursor<Payment[]>>(
      API_SEARCH,
      {
        ...(sanitizeQuery(request) as SearchBody),
        target: SearchTargets.PAYMENT,
        policy: SearchPolicies.AND,
        pageSize: 15,
      },
      'cursor'
    );

    return payments;
  });

  return handleResponse(res);
};

export default function Index() {
  const payments = useLoaderData<Payment[]>() as unknown as Payment[];

  return (
    <Page id="reconciliation">
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              ml: 'auto',
            }}
          >
            <Button variant="outlined" color="secondary">
              <span></span>
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            mt: 2,
            height: '300px',
          }}
        >
          <Box
            sx={{
              borderRadius: '6px',
              border: '1px solid rgb(239, 241, 246)',
              flex: 1,
              p: 2,
            }}
          >
            <Pie
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'left',
                  },
                },
              }}
              data={{
                labels: ['Reconciled', 'Unreconciled'],
                datasets: [
                  {
                    data: [7, 2],
                    backgroundColor: [
                      // soft green
                      'hsl(140, 100%, 80%)',
                      // soft red
                      'hsl(350, 90%, 70%)',
                    ],
                    hoverOffset: 4,
                  },
                ],
              }}
            />
          </Box>
          <Box
            sx={{
              borderRadius: '6px',
              border: '1px solid rgb(239, 241, 246)',
              flex: 2,
              p: 2,
            }}
          >
            <Bar
              options={{
                maintainAspectRatio: false,
              }}
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Reconciled',
                    data: [1, 2, 3, 4, 5, 6],
                    backgroundColor: 'hsl(140, 100%, 90%)',
                  },
                  {
                    label: 'Unreconciled',
                    data: [6, 5, 4, 3, 2, 1],
                    backgroundColor: 'hsl(350, 90%, 80%)',
                  },
                ],
              }}
            />
          </Box>
        </Box>
        <PaymentList payments={payments} withPagination={false} />
      </>
    </Page>
  );
}
