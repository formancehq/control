export const copyTokenToClipboard = async (value: string): Promise<void> =>
  await navigator.clipboard.writeText(value);
