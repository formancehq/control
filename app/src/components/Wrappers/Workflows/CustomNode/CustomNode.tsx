import React, { FunctionComponent, memo } from 'react';

import { get } from 'lodash';
import { Handle, Position } from 'reactflow';

import { CustomNodeProps } from './types';

import RunSend from '~/src/components/Wrappers/Workflows/histories/RunSend';
import CreateTransaction from '~/src/components/Wrappers/Workflows/histories/stages/CreateTransaction';
import DelayStage from '~/src/components/Wrappers/Workflows/stages/DelayStage';
import SendStage from '~/src/components/Wrappers/Workflows/stages/SendStage';
import WaitEventStage from '~/src/components/Wrappers/Workflows/stages/WaitEventStage/WaitEventStage';
import {
  OrchestrationRunHistories,
  OrchestrationStages,
  OrchestrationStageSendHistory,
} from '~/src/types/orchestration';

const CustomNode: FunctionComponent<CustomNodeProps> = ({
  data: { label, details, isHighLevel, isLowLevel },
  isConnectable,
  ...props
}) => {
  const map = {
    [OrchestrationStages.SEND]: <SendStage send={details.send} />,
    [OrchestrationStages.WAIT_EVENT]: (
      <WaitEventStage wait_event={details.wait_event} />
    ),
    [OrchestrationStages.DELAY]: <DelayStage delay={details.delay} />,
    [OrchestrationRunHistories.RUN_SEND]: <RunSend {...details} />,
    [OrchestrationRunHistories.RUN_DELAY]: (
      <WaitEventStage wait_event={details.input} />
    ),
    [OrchestrationRunHistories.RUN_WAIT_EVENT]: (
      <WaitEventStage wait_event={details.input} />
    ),
    [OrchestrationStageSendHistory.CREATE_TRANSACTION]: (
      <CreateTransaction {...details} />
    ),
  };

  return (
    <div className="custom-node">
      {isLowLevel && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
      )}
      {get(map, label)}
      {isHighLevel && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
};

export default memo(CustomNode);
