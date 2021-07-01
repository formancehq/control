import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;

  .actions {
    margin-left: auto;

    button {
      background: white;
      color: #111;
      border: solid 1px rgba(0, 0, 0, 0.1);

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }
  }

  .counter {
    flex: 1;
    font-size: 14px;
    opacity: 0.5;
  }
`;

function Pagination({handler, previous, next, total}) {
  return (
    <Wrapper>
      <div className="counter">
        {total > 0 && (
          <span>{total} results found</span>
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