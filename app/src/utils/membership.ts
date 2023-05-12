import { get } from 'lodash';

import { ObjectOf } from '~/src/types/generic';
import { MembershipOrganization, MembershipStack } from '~/src/types/stack';
import { ApiClient, CurrentUser } from '~/src/utils/api';

export const USER_METADATA_ROOT_KEY = 'console';

export const getStacks = async (api: ApiClient): Promise<MembershipStack[]> => {
  const organizations = await api.getResource<MembershipOrganization[]>(
    '/organizations',
    'data'
  );
  const stacks: MembershipStack[][] = [];

  if (organizations) {
    for (const organization of organizations) {
      const organizationStacks = await api.getResource<MembershipStack[]>(
        `/organizations/${organization.id}/stacks`,
        'data'
      );
      if (organizationStacks) {
        stacks.push(organizationStacks);
      }
    }
  }

  return stacks.flat();
};

export type FavoriteMetadata = {
  stackUrl?: string;
  stackId?: string;
  organizationId?: string;
};

export type UpdateMetadata = {
  metadata: {
    console: string;
  };
};
export const updateUserMetadata = async (
  api: ApiClient,
  metadata?: UpdateMetadata | undefined,
  callback?: () => void
): Promise<any> => {
  if (metadata) {
    await api.putResource<ObjectOf<any>>('/api/me', 'data', metadata);
    if (callback) callback();
  }
};

export const createFavoriteMetadata = (
  url: string
): UpdateMetadata | undefined => {
  if (!url) return;

  const s = url.split('-');

  return {
    metadata: {
      [USER_METADATA_ROOT_KEY]: JSON.stringify({
        stackUrl: url,
        organizationId: s[0].split('//')[1],
        stackId: s[1].split('.')[0],
      }),
    },
  };
};

export const getFavorites = (
  currentUser: CurrentUser
): FavoriteMetadata | undefined =>
  JSON.parse(get(currentUser, `metadata.${USER_METADATA_ROOT_KEY}`));
