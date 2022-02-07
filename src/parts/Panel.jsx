import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* background: white; */
  border-radius: 8px;
  /* box-shadow: rgba(0, 0, 0, 0.05) 1px 1px 2px 4px; */
  border: solid 1px #23272E;
  display: inline-block;
  padding: ${props => props.nopad ? 0 : '18px'};
  width: 100%;
  box-sizing: border-box;

  h1, h2 {
    margin-top: 0;
  }
`;

function Panel(props) {
  return (
    <Wrapper className='panel' {...props}></Wrapper>
  );
}

export default Panel;