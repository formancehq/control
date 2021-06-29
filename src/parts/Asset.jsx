import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  background: #eee;
  padding: 5px;
  border-radius: var(--theme-small-radius);
`;

function Asset(props) {
return <Wrapper>{props.data}</Wrapper>
}

export default Asset;