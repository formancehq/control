import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;

  .actions {
    margin-left: auto;

    button {
      /* background: white; */
      background: #5D6779;
      color: #16191D;
      border: solid 1px rgba(0, 0, 0, 0.1);

      &:disabled {
        background: #31363f;
        cursor: default;
      }

      &:first-child {
        margin-right: 10px;
      }
    }
  }

  .counter {
    flex: 1;
    font-size: 14px;
    opacity: 0.5;
  }
`;

function Pagination({handler, previous, next, total, size}) {
  return (
    <Wrapper>
      <div className="counter">
        {total > 0 && (
          <span>{total} results found</span>
        )}
        {total > 0 && size > 0 && (
          <span> • </span>
        )}
        {size > 0 && (
          <span>showing {size} results</span>
        )}
      </div>
      <div className="actions">
        <button onClick={() => handler("previous")} disabled={!previous}>Prev</button>
        <button onClick={() => handler("next")} disabled={!next}>Next</button>
      </div>
    </Wrapper>
  );
}

export default Pagination;