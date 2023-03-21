import React, { FunctionComponent } from 'react';

import { get } from 'lodash';
import { Handle, Position } from 'reactflow';

import { CustomNodeProps } from './types';

import DelayStage from '~/src/components/Wrappers/Workflows/stages/DelayStage';
import SendStage from '~/src/components/Wrappers/Workflows/stages/SendStage';
import WaitEventStage from '~/src/components/Wrappers/Workflows/stages/WaitEventStage/WaitEventStage';
import { OrchestrationStages } from '~/src/types/orchestration';

const handleStyle = { left: 10 };

const CustomNode: FunctionComponent<CustomNodeProps> = ({
  data: { label, details },
  isConnectable,
}) => {
  const map = {
    [OrchestrationStages.SEND]: <SendStage send={details.send} />,
    [OrchestrationStages.WAIT_EVENT]: (
      <WaitEventStage wait_event={details.wait_event} />
    ),
    [OrchestrationStages.DELAY]: <DelayStage delay={details.delay} />,
  };

  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      {get(map, label)}
    </div>
  );
};

export default CustomNode;
