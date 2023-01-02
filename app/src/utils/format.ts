import { Cursor } from '~/src/types/generic';

export const initials = (name: string, depth = 2): string | undefined => {
  if (name && name.length > 1) {
    if (depth === 1) {
      return `${name.split(' ')[0][0]}`.toUpperCase();
    }

    return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`.toUpperCase();
  }

  return undefined;
};

export const lowerCaseAllWordsExceptFirstLetter = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

export const buildCursor = <T>(items: T[]): Cursor<T> => ({
  data: items,
  hasMore: false,
  pageSize: 15,
  total: { value: 15, relation: 'OR' },
  previous: '',
  next: '',
});
