import { get } from 'lodash';

import { ObjectOf } from '~/src/types/generic';
import { MembershipOrganization, MembershipStack } from '~/src/types/stack';
import { ApiClient, CurrentUser } from '~/src/utils/api';

export const USER_METADATA_ROOT_KEY = 'console';

export const getStacks = async (
  api?: ApiClient,
  token?: string
): Promise<MembershipStack[]> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    if (!api) {
      fetch(`${process.env.MEMBERSHIP_URL_API}/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (response) => {
          const data = await response.json();
          const organizations: MembershipOrganization[] = get(data, 'data');
          if (organizations) {
            const promises: any = [];
            organizations.forEach((organization: MembershipOrganization) => {
              promises.push(
                fetch(
                  `${process.env.MEMBERSHIP_URL_API}/organizations/${organization.id}/stacks`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                ).then(async (res) => get(await res.json(), 'data'))
              );
            });
            Promise.all(promises).then((response) => {
              resolve(response.flat());
            });
          }
        })
        .catch(() => {
          reject('Error while fetching stacks');
        });
    } else {
      const organizations = await api.getResource<MembershipOrganization[]>(
        '/organizations',
        'data'
      );

      if (organizations && organizations.length > 0) {
        const stacks: MembershipStack[][] = [];
        for (const organization of organizations) {
          const organizationStacks = await api.getResource<MembershipStack[]>(
            `/organizations/${organization.id}/stacks`,
            'data'
          );
          if (organizationStacks) {
            stacks.push(organizationStacks);
          }
        }
        resolve(stacks.flat());
      }
    }
  });

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
  api?: ApiClient,
  data?: UpdateMetadata | undefined,
  callback?: () => void,
  token?: string
): Promise<any> => {
  if (data) {
    if (!api) {
      fetch(`${process.env.MEMBERSHIP_URL_API}/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }).then(async (response) => {
        if (response.status != 200) {
          throw new Error(`Error while updating user metadata`);
        }

        return await response.json();
      });
    } else {
      return await api.putResource<ObjectOf<any>>('/me', 'data', data);
    }
    if (callback) {
      callback();
    }
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
): FavoriteMetadata | undefined => {
  const json = get(currentUser, `metadata.${USER_METADATA_ROOT_KEY}`);
  if (json) {
    return JSON.parse(json);
  }
};

export const getStackApiUrl = (currentUser: CurrentUser): string | undefined =>
  `${get(getFavorites(currentUser), 'stackUrl')}/api`;
