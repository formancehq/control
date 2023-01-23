import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import Graphviz from 'graphviz-react';

import { PostingsGraphProps } from './types';

import { TransactionHybrid } from '~/src/types/ledger';

const PostingsGraph: FunctionComponent<PostingsGraphProps> = ({
  transactions,
}) => {
  let dot = '';
  transactions.map((transaction: TransactionHybrid) => {
    const splitSource: string[] = transaction.source.split(':');
    const splitDest: string[] = transaction.destination.split(':');
    let source: string = transaction.source;
    let destination: string = transaction.destination;

    // Dot language is escaping semicolon from label.
    // To use semicolon as label we need to use dot special char <> encoding
    if (splitSource.length > 0) {
      source = `<${transaction.source}>`;
    }
    if (splitDest.length > 0) {
      destination = `<${transaction.destination}>`;
    }
    dot = `${dot} 
           ${source} -> ${destination}[label="${transaction.asset} ${transaction.amount}",weight="${transaction.amount}"];`;
  });

  return (
    <Box
      sx={{
        textAlign: 'center',
        borderRadius: '6px',
        border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
      }}
    >
      <Graphviz
        className="Graph"
        options={{
          height: 300,
          width: 600,
          useWorker: false,
          useSharedWorker: false,
        }}
        dot={`digraph {
              rankdir=LR
              ${dot}
            }`}
      />
    </Box>
  );
};

export default PostingsGraph;
