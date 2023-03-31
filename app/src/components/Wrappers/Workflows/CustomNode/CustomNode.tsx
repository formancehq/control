import React, { FunctionComponent, memo } from 'react';

import { get } from 'lodash';
import { Handle, Position } from 'reactflow';

import { CustomNodeProps } from './types';

import CreateTransaction from '~/src/components/Wrappers/Workflows/histories/activities/CreateTransaction';
import CreditWallet from '~/src/components/Wrappers/Workflows/histories/activities/CreditWallet';
import DebitWallet from '~/src/components/Wrappers/Workflows/histories/activities/DebitWallet';
import GetAccount from '~/src/components/Wrappers/Workflows/histories/activities/GetAccount';
import GetPayment from '~/src/components/Wrappers/Workflows/histories/activities/GetPayment';
import GetWallet from '~/src/components/Wrappers/Workflows/histories/activities/GetWallet';
import RevertTransaction from '~/src/components/Wrappers/Workflows/histories/activities/RevertTransaction';
import StripeTransfer from '~/src/components/Wrappers/Workflows/histories/activities/StripeTransfer';
import RunSend from '~/src/components/Wrappers/Workflows/histories/RunSend';
import DelayStage from '~/src/components/Wrappers/Workflows/stages/DelayStage';
import SendStage from '~/src/components/Wrappers/Workflows/stages/SendStage';
import WaitEventStage from '~/src/components/Wrappers/Workflows/stages/WaitEventStage/WaitEventStage';
import {
  OrchestrationRunHistories,
  OrchestrationStages,
  OrchestrationStageSendHistory,
} from '~/src/types/orchestration';

const CustomNode: FunctionComponent<CustomNodeProps> = ({
  data: { label, details, isHighLevel = false, isLowLevel = false },
  isConnectable,
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
    [OrchestrationStageSendHistory.REVERT_TRANSACTION]: (
      <RevertTransaction {...details} />
    ),
    [OrchestrationStageSendHistory.GET_PAYMENT]: <GetPayment {...details} />,
    [OrchestrationStageSendHistory.GET_WALLET]: <GetWallet {...details} />,
    [OrchestrationStageSendHistory.GET_ACCOUNT]: <GetAccount {...details} />,
    [OrchestrationStageSendHistory.CREDIT_WALLET]: (
      <CreditWallet {...details} />
    ),
    [OrchestrationStageSendHistory.DEBIT_WALLET]: <DebitWallet {...details} />,
    [OrchestrationStageSendHistory.STRIPE_TRANSFER]: (
      <StripeTransfer {...details} />
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
