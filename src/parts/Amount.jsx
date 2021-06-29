import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  font-family: 'Roboto Mono', monospace;
  
  color: ${props => {
    if (!props.color) {
      return 'inherit';
    }

    if (props.amount === 0) {
      return 'inherit';
    }
    
    return props.amount > 0 ? 'rgb(91, 181, 124)' : 'rgb(254, 118, 118)';
  }};
`;

function Amount(props) {
  const amount = props.data || props.children
  return (
    <Wrapper
      amount={amount}
      color={props.color ? 1 : 0}>{amount}</Wrapper>
  );
}

export default Amount;