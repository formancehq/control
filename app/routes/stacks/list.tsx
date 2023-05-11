import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import type { MetaFunction, Session } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Select } from '@numaryhq/storybook';

import { useService } from '~/src/hooks/useService';
import { ObjectOf } from '~/src/types/generic';
import { MembershipStack } from '~/src/types/stack';
import { createReactApiClient } from '~/src/utils/api.client';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { getStacks } from '~/src/utils/membership';

export const meta: MetaFunction = () => ({
  title: 'Stacks',
  description: 'Get a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(
      session,
      `${process.env.MEMBERSHIP_URL}/api`,
      true
    );

    return await getStacks(api);
  }

  return handleResponse(await withSession(request, handleData));
};

export const StackList: FunctionComponent = () => {
  const fetcher = useFetcher<MembershipStack[] | null>();
  const { t } = useTranslation();
  const { metas } = useService();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    fetcher.load('/stacks/list');
    setValue(
      localStorage.getItem('currentStack') || get(fetcher, 'data[0].uri', '')
    );
  }, []);

  const onChange = async (event: SelectChangeEvent<unknown>) => {
    if (typeof event.target.value === 'string') {
      localStorage.setItem('currentStack', event.target.value as string);
      setValue(event.target.value);
      await createReactApiClient(metas.membership).putResource<ObjectOf<any>>(
        `/api/users/${currentUser.sub}`,
        undefined,
        { metadata: { lastStack: stack.uri } }
      );
    }
  };

  return (
    <Select
      items={
        fetcher.data
          ? fetcher.data.map((stack: MembershipStack, index: number) => ({
              id: stack.uri ? stack.uri : index,
              label: `${stack.name} ${stack.organizationId}-${stack.id}`,
            }))
          : []
      }
      placeholder={t('common.filters.stacks')}
      select={{
        onChange,
        value,
      }}
    />
  );
};
