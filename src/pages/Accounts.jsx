import * as React from 'react';
import styled from 'styled-components';
import AccountsTable from '../components/AccountsTable.jsx';

const Wrapper = styled.div`
  /* display: flex; */
`;

function Accounts() {
  return (
    <Wrapper>
      <div className="top-container mt40 mb40">
        <AccountsTable paginate></AccountsTable>
      </div>
    </Wrapper>
  );
}

export default Accounts;