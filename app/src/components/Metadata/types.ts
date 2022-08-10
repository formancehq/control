import { ObjectOf } from '~/src/types/generic';

export type MetadataProps = {
  metadata: ObjectOf<any>;
  title: string;
  resource: string;
  id: string;
};
