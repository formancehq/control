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
