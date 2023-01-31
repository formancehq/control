import * as React from 'react';

import type { MetaFunction, Session } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';

import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Version',
  description: 'Display control version',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(_session: Session) {
    if (process.env.VERSION) {
      return { version: process.env.VERSION };
    }

    return { version: null };
  }

  return handleResponse(await withSession(request, handleData));
};
