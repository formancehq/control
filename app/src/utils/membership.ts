import { ObjectOf } from '~/src/types/generic';
import { MembershipOrganization, MembershipStack } from '~/src/types/stack';
import { ApiClient } from '~/src/utils/api';

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

export const updateLastStack = async (
  api: ApiClient,
  idCurrentUser: string,
  uri: string,
  contextUpdater?: () => void
): Promise<any> => {
  try {
    const metadata = await api.putResource<ObjectOf<any>>(
      `/api/users/${idCurrentUser}`,
      undefined,
      { metadata: { lastStack: uri } }
    );
    console.log('metadata', metadata);
    if (metadata && contextUpdater) {
      contextUpdater();
    }
  } catch (e) {
    console.log('eeeeeeeee metadata', e);
  }
};
