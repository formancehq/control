import * as React from 'react';
import styled from 'styled-components';
import Table from '../parts/Table.jsx';
import Panel from '../parts/Panel.jsx';
import Amount from '../parts/Amount.jsx';

const Wrapper = styled.div`
  
`;

const columns = [
  {
    Header: "Asset",
    accessor: ({asset}) => {
      return (
        <span>{asset}</span>
      );
    }
  },
  {
    Header: "Balance",
    accessor: ({balance}) => {
      return (
        <Amount>{balance}</Amount>
      );
    }
  },
];

function Balances({balances}) {
  const rows = [];

  for (let asset of Object.keys(balances)) {
    rows.push({
      asset,
      balance: balances[asset],
    });
  }

  return (
    <div>
      <Panel nopad>
        <Table
          columns={columns}
          data={rows}></Table>
      </Panel>
    </div>
  );
}

export default Balances;