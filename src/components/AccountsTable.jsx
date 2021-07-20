import * as React from 'react';
import styled from 'styled-components';
import ledger from '../lib/ledger';
import Table from '../parts/Table.jsx';
import Panel from '../parts/Panel.jsx';
import Address from '../parts/Address.jsx';
import Pagination from '../parts/Pagination.jsx';
import Empty from './EmptyLedger.jsx';

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
      ready: false,
      pagination: {
        hasMore: false,
        total: 0,
        pageSize: 0,
        previous: [],
        query: {},
      },
    };

    this.fetch = this.fetch.bind(this);
    this.paginationHandler = this.paginationHandler.bind(this);
  }

  paginationHandler(event) {
    let pagination;

    switch (event) {
      case "next":
        this.setState({
          pagination: {
            ...this.state.pagination,

            previous: [
              ...this.state.pagination.previous,
              this.state.pagination.query
            ],

            query: {
              after: this.state.accounts[this.state.accounts.length - 1].address,
            },
          },
        }, this.fetch);

        break;
      
      case "previous":
        const previous = [...this.state.pagination.previous];
        const query = previous.pop();

        pagination = {
          ...this.state.pagination,
          previous,
          query,
        };

        this.setState({pagination}, this.fetch);
        break;
    
      default:
        break;
    }
  }

  fetch() {
    ledger()
    .getAccounts(this.state.pagination.query)
    .then((data) => {
      this.setState({
        ready: true,
        accounts: data.cursor.data,
        pagination: {
          ...this.state.pagination,
          hasMore: data.cursor.has_more,
          total: data.cursor.total,
        },
      });
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    if (this.state.ready && this.state.accounts.length == 0) {
      return <Empty></Empty>;
    }


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
          total={this.state.pagination.total}
          size={this.state.accounts.length}
          previous={this.state.pagination.previous.length}
          next={this.state.pagination.hasMore}
          handler={this.paginationHandler}></Pagination>
      </Wrapper>
    );
  }
}

export default Accounts;