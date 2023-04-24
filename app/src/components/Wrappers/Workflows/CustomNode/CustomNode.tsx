import React, { FunctionComponent, memo } from 'react';

import { Box } from '@mui/material';
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
  width = '100%',
}) => {
  const input = get(details, 'input', {}) || {};
  const output = get(details, 'output', {}) || {};
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
      <CreateTransaction
        {...{
          ...get(
            output,
            `${[OrchestrationStageSendHistory.CREATE_TRANSACTION]}.data[0]`
          ),
          ledger: get(
            input,
            `${[OrchestrationStageSendHistory.CREATE_TRANSACTION]}.ledger`
          ),
        }}
      />
    ),
    [OrchestrationStageSendHistory.REVERT_TRANSACTION]: <RevertTransaction />,
    [OrchestrationStageSendHistory.GET_PAYMENT]: (
      <GetPayment
        {...{
          ...get(output, `${[OrchestrationStageSendHistory.GET_PAYMENT]}.data`),
        }}
      />
    ),
    [OrchestrationStageSendHistory.GET_WALLET]: (
      <GetWallet
        {...{
          ...get(output, `${[OrchestrationStageSendHistory.GET_WALLET]}.data`),
        }}
      />
    ),
    [OrchestrationStageSendHistory.GET_ACCOUNT]: (
      <GetAccount
        {...{
          ...get(output, `${[OrchestrationStageSendHistory.GET_ACCOUNT]}.data`),
          ledger: get(
            input,
            `${[OrchestrationStageSendHistory.GET_ACCOUNT]}.ledger`
          ),
        }}
      />
    ),
    [OrchestrationStageSendHistory.CREDIT_WALLET]: (
      <CreditWallet
        {...{
          ...get(
            input,
            `${[OrchestrationStageSendHistory.CREDIT_WALLET]}.data`
          ),
        }}
      />
    ),
    [OrchestrationStageSendHistory.DEBIT_WALLET]: (
      <DebitWallet
        {...{
          ...get(input, `${[OrchestrationStageSendHistory.DEBIT_WALLET]}.data`),
        }}
      />
    ),
    [OrchestrationStageSendHistory.STRIPE_TRANSFER]: (
      <StripeTransfer
        {...{
          ...get(input, [OrchestrationStageSendHistory.STRIPE_TRANSFER]),
        }}
      />
    ),
  };

  return (
    <Box className="custom-node" sx={{ width }}>
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
    </Box>
  );
};

export default memo(CustomNode);
