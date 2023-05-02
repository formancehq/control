import React from 'react';

import {
  ArrowCircleUp,
  Block,
  Done,
  East,
  ErrorOutline,
  HourglassTop,
  LoopOutlined,
  MoreHoriz,
  NorthEast,
  PauseCircle,
  PauseCircleOutline,
  Schedule,
  SouthEast,
} from '@mui/icons-material';

import { ConnectorStatuses, TaskStatuses } from '~/src/types/connectorsConfig';
import {
  OrchestrationInstanceStatuses,
  OrchestrationStages,
} from '~/src/types/orchestration';
import { GatewayServiceStatus } from '~/src/types/gateway';
import { PaymentStatuses, PaymentTypes } from '~/src/types/payment';

export const paymentIconMap = {
  [PaymentStatuses.FAILED]: <ErrorOutline />,
  [PaymentStatuses.SUCCEEDED]: <Done />,
  [PaymentStatuses.PENDING]: <HourglassTop />,
  [PaymentStatuses.CANCELLED]: <Block />,
  [PaymentStatuses.OTHER]: <MoreHoriz />,
};

export const paymentTypeColorMap = {
  [PaymentTypes.PAY_OUT]: 'neutral[200]',
  [PaymentTypes.PAY_IN]: 'blue',
  [PaymentTypes.TRANSFER]: 'brown',
  [PaymentTypes.OTHER]: 'secondary',
};

export const paymentTypeIconMap = {
  [PaymentTypes.PAY_OUT]: <NorthEast />,
  [PaymentTypes.PAY_IN]: <SouthEast />,
  [PaymentTypes.TRANSFER]: <East />,
  [PaymentTypes.OTHER]: <MoreHoriz />,
};

export const paymentColorMap = {
  [PaymentStatuses.FAILED]: 'red',
  [PaymentStatuses.SUCCEEDED]: 'green',
  [PaymentStatuses.PENDING]: 'blue',
  [PaymentStatuses.CANCELLED]: 'brown',
  [PaymentStatuses.OTHER]: 'violet',
};

export const appTaskIconMap = {
  [TaskStatuses.STOPPED]: <PauseCircle />,
  [TaskStatuses.PENDING]: <HourglassTop />,
  [TaskStatuses.TERMINATED]: <Done />,
  [TaskStatuses.FAILED]: <ErrorOutline />,
  [TaskStatuses.ACTIVE]: <LoopOutlined />,
};
export const appTaskColorMap = {
  [TaskStatuses.STOPPED]: 'brown',
  [TaskStatuses.PENDING]: 'blue',
  [TaskStatuses.TERMINATED]: 'blue',
  [TaskStatuses.FAILED]: 'red',
  [TaskStatuses.ACTIVE]: 'green',
};

export const appIconMap = {
  [ConnectorStatuses.ACTIVE]: <Done />,
  [ConnectorStatuses.INACTIVE]: <PauseCircle />,
};

export const appColorMap = {
  [ConnectorStatuses.ACTIVE]: 'green',
  [ConnectorStatuses.INACTIVE]: 'red',
};

export const orchestrationStagesIconMap = {
  [OrchestrationStages.DELAY]: <Schedule />,
  [OrchestrationStages.WAIT_EVENT]: <PauseCircleOutline />,
  [OrchestrationStages.SEND]: <ArrowCircleUp />,
};

export const orchestrationInstanceStatusIconMap = {
  [OrchestrationInstanceStatuses.TERMINATED]: <Done />,
  [OrchestrationInstanceStatuses.RUNNING]: <LoopOutlined />,
};
export const orchestrationInstanceStatusColorMap = {
  [OrchestrationInstanceStatuses.TERMINATED]: 'red',
  [OrchestrationInstanceStatuses.RUNNING]: 'violet',
};

export const gatewayServicesIconMap = {
  [GatewayServiceStatus.UP]: <Done />,
  [GatewayServiceStatus.DOWN]: <ErrorOutline />,
};
export const gatewayServicesColorMap = {
  [GatewayServiceStatus.UP]: 'green',
  [GatewayServiceStatus.DOWN]: 'red',
};
