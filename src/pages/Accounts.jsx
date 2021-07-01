import * as React from 'react';
import styled from 'styled-components';
import AccountsTable from '../components/AccountsTable.jsx';
import Navbar from '../parts/Navbar.jsx';

const Wrapper = styled.div`
  
`;

function Transactions() {
  return (
    <Wrapper>
      <Navbar></Navbar>
      <div className="top-container mt40 mb40">
        <AccountsTable paginate></AccountsTable>
      </div>
    </Wrapper>
  );
}

export default Transactions;