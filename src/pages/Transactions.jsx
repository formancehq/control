import * as React from 'react';
import styled from 'styled-components';
import TransactionsTable from '../components/TransactionsTable.jsx';

const Wrapper = styled.div`
  
`;

function Transactions() {
  return (
    <Wrapper>
      <div className="top-container mt20 mb40">
        <TransactionsTable paginate></TransactionsTable>
      </div>
    </Wrapper>
  );
}

export default Transactions;