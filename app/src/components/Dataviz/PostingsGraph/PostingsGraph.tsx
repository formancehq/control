import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import Graphviz from 'graphviz-react';

import { PostingsGraphProps } from './types';

import { Posting } from '~/src/types/ledger';

const PostingsGraph: FunctionComponent<PostingsGraphProps> = ({ postings }) => {
  let dot = '';

  postings.map((posting: Posting) => {
    const splitSource: string[] = posting.source.split(':');
    const splitDest: string[] = posting.destination.split(':');
    let source: string = posting.source;
    let destination: string = posting.destination;

    // Dot language is escaping semicolon from label.
    // To use semicolon as label we need to use dot special char <> encoding
    if (splitSource.length > 0) {
      source = `<${posting.source}>`;
    }
    if (splitDest.length > 0) {
      destination = `<${posting.destination}>`;
    }
    dot = `${dot} 
           ${source} -> ${destination}[label="${posting.asset} ${posting.amount}",weight="${posting.amount}"];`;
  });

  return (
    <Box
      sx={{
        textAlign: 'center',
        borderRadius: '6px',
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
