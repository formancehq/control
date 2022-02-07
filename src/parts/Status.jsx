import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 16px;

  font-family: 'Roboto Mono', monospace;
  text-transform: capitalize;

  background: #29303D;
  color: #CBD0D7;
`;

function Status({children: status}) {
  return (
    <Wrapper className="status">
      <span>{status}</span>
    </Wrapper>
  );
}

export default Status;