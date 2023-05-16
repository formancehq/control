import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import type { MetaFunction, Session } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get, isEmpty, noop } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Select } from '@numaryhq/storybook';

import { useService } from '~/src/hooks/useService';
import { MembershipStack } from '~/src/types/stack';
import { createReactApiClient } from '~/src/utils/api.client';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import {
  createFavoriteMetadata,
  getFavorites,
  getStacks,
  updateUserMetadata,
} from '~/src/utils/membership';

export const meta: MetaFunction = () => ({
  title: 'Stacks',
  description: 'Get a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(
      session,
      `${process.env.MEMBERSHIP_URL_API}`,
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
  const { currentUser, setService, ...rest } = useService();
  const stackUrl = get(getFavorites(currentUser), 'stackUrl');
  const [value, setValue] = useState<string>(stackUrl || '');
  useEffect(() => {
    fetcher.load('/stacks/list');
  }, []);

  const onChange = async (event: SelectChangeEvent<unknown>) => {
    if (typeof event.target.value === 'string') {
      const val = event.target.value;
      if (!isEmpty(val)) {
        setValue(val);
        const api = await createReactApiClient(metas.membership, true);
        const metadata = createFavoriteMetadata(val);
        try {
          await updateUserMetadata(api, metadata, () =>
            setService({
              ...rest,
              currentUser: { ...currentUser, metadata },
              setService,
            })
          );
        } catch {
          noop();
        }
      }
    }
  };

  return (
    <Select
      items={
        fetcher.data
          ? fetcher.data
              .filter((stack: MembershipStack) => stack.uri)
              .map((stack: MembershipStack) => ({
                id: stack.uri,
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
