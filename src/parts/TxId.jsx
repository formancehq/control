import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  color: #929BAB;
  font-family: 'Roboto Mono', monospace;
  display: inline-block;
`;

function TxId({children: id}) {
  return (
    <Wrapper className="txid">{`${id}`.padStart(6, '0')}</Wrapper>
  );
}

export default TxId;