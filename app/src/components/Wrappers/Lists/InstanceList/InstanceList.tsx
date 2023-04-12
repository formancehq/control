import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import { INSTANCE_ROUTE } from '~/src/components/Layout/routes';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import { InstanceListProps } from '~/src/components/Wrappers/Lists/InstanceList/types';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  orchestrationInstanceStatusColorMap,
  orchestrationInstanceStatusIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import {
  OrchestrationInstance,
  OrchestrationInstanceStatuses,
} from '~/src/types/orchestration';

const InstanceList: FunctionComponent<InstanceListProps> = ({ instances }) => {
  const { t } = useTranslation();

  return (
    <Table
      id="instance-list"
      items={instances}
      action={true}
      withPagination={false}
      columns={[
        {
          key: 'id',
          label: t('pages.instances.table.columnLabel.id'),
          width: 40,
        },
        {
          key: 'status',
          label: t('pages.instances.table.columnLabel.status'),
          width: 40,
        },
        {
          key: 'createdAt',
          label: t('pages.instances.table.columnLabel.createdAt'),
          width: 20,
        },
      ]}
      renderItem={(instance: OrchestrationInstance, index: number) => (
        <Row
          key={index}
          keys={[
            <Chip
              key={index}
              label={instance.id}
              variant="square"
              color="yellow"
            />,
            <Box
              component="span"
              display="flex"
              alignItems="center"
              key={index}
            >
              <StatusChip
                status={
                  instance.terminated
                    ? OrchestrationInstanceStatuses.TERMINATED
                    : OrchestrationInstanceStatuses.RUNNING
                }
                iconMap={orchestrationInstanceStatusIconMap}
                colorMap={orchestrationInstanceStatusColorMap}
              />
            </Box>,
            <Date key={index} timestamp={instance.createdAt} />,
          ]}
          item={instance}
          renderActions={() => (
            <ShowListAction id={instance.id} route={INSTANCE_ROUTE} />
          )}
        />
      )}
    />
  );
};

export default InstanceList;
