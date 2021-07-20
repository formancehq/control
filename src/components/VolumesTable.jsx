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
    Header: "Received",
    group: 'volumes',
    accessor: ({volumes}) => {
      return (
        <Amount color="green">{volumes["input"] || 0}</Amount>
      )
    },
  },
  {
    Header: "Sent",
    group: 'volumes',
    accessor: ({volumes}) => {
      return (
        <Amount color="red">{volumes["output"] || 0}</Amount>
      )
    },
  }
];

function Volumes({volumes}) {
  const rows = [];

  for (let asset of Object.keys(volumes)) {
    const row = {
      asset,
      volumes: volumes[asset],
    }

    rows.push(row);
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

export default Volumes;