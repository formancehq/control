import React, { FunctionComponent } from 'react';
import { MetadataProps } from './types';
import { normalizeMetadata } from './utils';
import { SectionWrapper } from '@numaryhq/storybook';
import Table from '../Table';
import Row from '../Table/components/Row';
import { TableConfig } from '~/src/types/generic';
import { Metadata as MetadataType } from '~/src/types/ledger';

const Metadata: FunctionComponent<MetadataProps> = ({
  metadata,
  title,
  resource,
  id,
}) => (
  <SectionWrapper title={title}>
    <Table
      withPagination={false}
      key={`${id}-metadata`}
      items={normalizeMetadata(metadata)}
      columns={[
        { key: 'metadata.key', width: 20 },
        { key: 'metadata.value' },
        { key: TableConfig.ACTIONS },
      ]}
      resource={`ledgers.${resource}.details`}
      renderItem={(metadata: MetadataType) => (
        <Row keys={['key', 'value']} item={metadata} id={id} />
      )}
    />
  </SectionWrapper>
);

export default Metadata;
