import * as React from 'react';
import styled from 'styled-components';
import TransactionsTable from '../components/TransactionsTable.jsx';
import Navbar from '../parts/Navbar.jsx';
import Panel from '../parts/Panel.jsx';

const Wrapper = styled.div`
  
`;

function Transactions() {
  return (
    <Wrapper>
      <Navbar></Navbar>
      <div className="top-container mt40 mb40">
        <TransactionsTable paginate></TransactionsTable>
      </div>
    </Wrapper>
  );
}

export default Transactions;