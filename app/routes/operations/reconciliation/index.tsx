import * as React from 'react';
import { useEffect } from 'react';

import { Box, Button, useTheme } from '@mui/material';
import { LoaderFunction, MetaFunction } from '@remix-run/node';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useLoaderData } from 'remix';

import { Page } from '@numaryhq/storybook';

import { reconciliation as reconciliationConfig } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
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

export const meta: MetaFunction = () => ({
  title: 'Reconciliation',
  description: 'Show reco',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={reconciliationConfig.id}
      title="pages.reconciliation.title"
      error={error}
    />
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const res = await withSession(request, async (session) =>
    (
      await createApiClient(session)
    ).postResource<Cursor<Payment[]>>(
      API_SEARCH,
      {
        ...(sanitizeQuery(request) as SearchBody),
        target: SearchTargets.PAYMENT,
        policy: SearchPolicies.AND,
        pageSize: 15,
      },
      'cursor'
    )
  );

  return handleResponse(res);
};

export default function Index() {
  const payments = useLoaderData<Payment[]>() as unknown as Payment[];
  const { palette } = useTheme();

  // TODO remove this error once reco is ready to be released
  useEffect(() => {
    throw 'Not ready yet !';
  }, []);

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
              border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
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
                      palette.green.light,
                      // soft red
                      palette.red.light,
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
              border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
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
                    backgroundColor: palette.green.light,
                  },
                  {
                    label: 'Unreconciled',
                    data: [6, 5, 4, 3, 2, 1],
                    backgroundColor: palette.red.light,
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
