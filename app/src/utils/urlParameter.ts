export default (param: string, url: string): string => {
  const params = new URLSearchParams(url);

  return params.get(param) || '';
};
