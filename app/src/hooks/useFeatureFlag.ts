import { FEATURES } from '~/src/contexts/service';
import { useService } from '~/src/hooks/useService';
import { Errors } from '~/src/types/generic';

export function useFeatureFlag(feature: FEATURES): Error | void {
  const { featuresDisabled } = useService();

  if (featuresDisabled.includes(feature)) {
    throw Error(Errors.UNAUTHORIZED);
  }
}
