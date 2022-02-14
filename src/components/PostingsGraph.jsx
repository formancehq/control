import { Box } from '@mui/material';
import Graphviz from 'graphviz-react';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: hsl(218deg 13% 12%);
  width: 100%;
  border-radius: 4px;
  padding: 20px;

  polygon {
    fill: transparent;
  }

  .edge>path {
    stroke: hsl(218deg 13% 18%);
  }

  .edge>polygon {
    stroke: hsl(218deg 13% 18%);
    fill: hsl(218deg 13% 18%);
  }

  .node>ellipse {
    stroke: hsl(218deg 13% 18%);
    fill: hsl(218deg 13% 18%);
  }

  text {
    font-family: 'Roboto Mono', monospace;
    font-size: 12px;
    fill: hsl(218deg 13% 72%);
  }
`;

const PostingsGraph = ({ postings }) => {
  let dot = '';

  postings.map((posting) => {
    const splitSource = posting.source.split(':');
    const splitDest = posting.destination.split(':');
    let source = posting.source;
    let destination = posting.destination;

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
    <Wrapper>
      <Box sx={{ textAlign: 'center' }}>
        <Graphviz
          className="Graph"
          options={{
            width: 700,
            height: 300,
            fit: true,
            useWorker: false,
            useSharedWorker: false,
          }}
          dot={`digraph {
                rankdir=LR
                ${dot}
              }`}/>
      </Box>
    </Wrapper>
  );
};

export default PostingsGraph;