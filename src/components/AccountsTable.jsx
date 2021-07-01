import * as React from 'react';
import styled from 'styled-components';
import * as server from '../lib/ledger';
import Table from '../parts/Table.jsx';
import Panel from '../parts/Panel.jsx';
import Address from '../parts/Address.jsx';
import Pagination from '../parts/Pagination.jsx';

const Wrapper = styled.div`
  .panel .top {
    /* display: flex; */
    padding: 18px;
    padding-bottom: 2px;
    margin-bottom: 20px;
  }
`;

const columns = [
  {
    Header: "Address",
    className: 'left',
    accessor: ({address}) => {
      return (
        <Address data={address}></Address>
      );
    }
  },
  {
    Header: "Type",
    accessor: () => {
      return 'virtual';
    }
  },
];

class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      pagination: {
        total: 0,
      },
    };

    this.fetch = this.fetch.bind(this);
  }

  fetch() {
    server
    .getAccounts()
    .then((data) => {
      this.setState({
        accounts: data.cursor.data,
        pagination: {
          total: data.cursor.total,
        },
      });
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Wrapper>
        <Panel nopad>
          <Table
            columns={columns}
            data={this.state.accounts}
            empty={
              <div>
                <span>No accounts yet</span>
              </div>
            }></Table>
        </Panel>
        <Pagination
          total={this.state.pagination.total}></Pagination>
      </Wrapper>
    );
  }
}

export default Accounts;