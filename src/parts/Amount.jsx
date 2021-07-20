import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  font-family: 'Roboto Mono', monospace;

  &.green {
    color: rgb(91, 181, 124);
  }

  &.red {
    color: rgb(254, 118, 118);
  }
`;

function Amount(props) {
  const amount = props.data || props.children
  return (
    <Wrapper className={props.color}>{amount}</Wrapper>
  );
}

export default Amount;