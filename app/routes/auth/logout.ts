import { redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async (): Promise<TypedResponse> =>
  redirect('/');
