export const API_SEARCH = '/search';
export const API_LEDGER = '/ledger';
export const API_PAYMENT = '/payments';
export const API_AUTH = '/auth';

export const logger = (
  stack?: any,
  from?: string,
  response?: any,
  request?: any
) => {
  // eslint-disable-next-line no-console
  console.error({
    from: from || 'utils/api',
    request,
    response,
    stack,
    page: typeof window !== 'undefined' ? window.location : '',
  });
};
