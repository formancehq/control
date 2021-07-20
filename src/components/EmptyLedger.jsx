import * as React from 'react';
import styled from 'styled-components'
import Panel from '../parts/Panel.jsx';

const Wrapper = styled.div`
  width: 600px;
  margin: auto;
`;

function Empty() {
  return (
    <Wrapper>
      <Panel>
        <h2 className="fw500 text-center">This legder brand new ✨</h2>
        <h3 className="fw300 text-center">Add your first transaction to get started</h3>
      </Panel>
    </Wrapper>
  )
}

export default Empty;