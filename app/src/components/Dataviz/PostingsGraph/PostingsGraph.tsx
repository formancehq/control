import { Box, useTheme } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { PostingsGraphProps } from './types';
import { Posting } from '~/src/types/ledger';
import Graphviz from 'graphviz-react';

const PostingsGraph: FunctionComponent<PostingsGraphProps> = ({ postings }) => {
  let dot = '';
  const { palette, typography } = useTheme();

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
        borderRadius: '4px',
        backgroundColor: palette.neutral[0],
        border: `1px solid ${palette.neutral[200]}`,
        '& .Graph svg g polygon': {
          fill: palette.neutral[0],
        },
        '& .Graph .node text .edge text': {
          ...typography.money,
        },
        '& .Graph .node ellipse': {
          fill: palette.neutral[0],
        },
        '& .Graph .edge polygon': {
          fill: palette.neutral[900],
        },
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
