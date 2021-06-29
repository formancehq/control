import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 120px;

  @media (max-width: 900px) {
      padding: 0 20px;
    }

  div {
    flex: 1 calc(50%);
    box-sizing: border-box;
    padding: 20px 0;

    @media (max-width: 900px) {
      flex: 1 100%;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
    }

    p {
      line-height: 28px;
      text-align: justify;
      max-width: 90%;
    }
    
    &:nth-child(1), &:nth-child(3) {
      @media (min-width: 900px) {
        padding-right: 20px;
      }
    }

    &:nth-child(2), &:nth-child(4) {
      @media (min-width: 900px) {
        padding-left: 20px;
      }
    }
  }
`;

function Grid({children}) {
  return (
    <Wrapper className="grid">{children}</Wrapper>
  );
}

export default Grid;