import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* background: #F5F5F5; */
  border-radius: 4px;
  /* box-shadow: rgba(0, 0, 0, 0.05) 2px 2px 4px; */
  border: solid 0.7px rgba(16, 0, 70, 0.1);
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