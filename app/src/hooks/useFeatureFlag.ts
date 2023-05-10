import { FEATURES } from '~/src/contexts/service';
import { useService } from '~/src/hooks/useService';
import { Errors } from '~/src/types/generic';

export function useFeatureFlag(feature: FEATURES): Error | void {
  const { featuresDisabled, metas } = useService();

  if (
    featuresDisabled.includes(feature) ||
    metas.shouldRedirectToStackOnboarding
  ) {
    throw Error(Errors.UNAUTHORIZED);
  }
}
