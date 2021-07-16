import * as React from 'react';
import styled from 'styled-components'
import ledger from '../lib/ledger';
import Address from '../parts/Address.jsx';
import Amount from '../parts/Amount.jsx';
import Table from '../parts/Table.jsx';
import TxId from '../parts/TxId.jsx';
import Status from '../parts/Status.jsx';
import Panel from '../parts/Panel.jsx';
import Pagination from '../parts/Pagination.jsx';

const Wrapper = styled.div`
  .asset {
    font-family: 'Roboto Mono', monospace;
  }
  
  .pagination {
    display: flex;
    justify-content: center;

    ul {
      margin: 0;
      padding: 10px;
      list-style-type: none;
      display: flex;
      font-size: 12px;

      li {
        cursor: pointer;
        
        opacity: 0.4;
        
        padding: 5px;
        margin: 0 10px;
        border-bottom: solid 2px rgba(0, 0, 0, 0.4);

        &.active {
          opacity: 1;
        }
      }
    }
  }
`;

const ActionsWrapper = styled.div``;

const columns = [
  {
    Header: "# TXID",
    groups: ['full'],
    accessor: row => {
      return (
        <TxId>{row.txid}</TxId>
      );
    },
  },
  {
    Header: "Status",
    groups: ['full', 'simple'],
    accessor: () => {
      return <Status>completed</Status>;
    },
  },
  {
    Header: "Value",
    groups: ['full', 'simple'],
    className: 'left',
    accessor: row => {
      return (
        <div>
          <span className="asset">{row.asset} </span>
          <Amount>{row.amount}</Amount>
        </div>
      )
    },
  },
  // {
  //   Header: "Asset",
  //   groups: ['full', 'simple'],
  //   accessor: row => {
  //     return (
  //       <Asset data={row.asset}></Asset>
  //     );
  //   },
  // },
  {
    Header: "Source",
    groups: ['full', 'simple'],
    className: 'left',
    accessor: (row) => {
      return (
        <Address data={row.source}></Address>
      );
    },
  },
  {
    Header: "Destination",
    groups: ['full', 'simple'],
    className: 'left',
    accessor: (row) => {
      return (
        <Address data={row.destination}></Address>
      );
    },
  },
  // {
  //   Header: "Ref",
  //   groups: ['full', 'simple'],
  //   className: 'left',
  //   accessor: (row) => {
  //     return row["ref"] || "no-data";
  //   },
  // },
  {
    Header: "Date",
    groups: ['full'],
    // accessor: "timestamp",
    accessor: (row) => {
      return new Date(row.timestamp).toDateString();
    }
  },
  // {
  //   Header: "Actions",
  //   groups: ['full'],
  //   accessor: (row) => {
  //     return (
  //       <ActionsWrapper>
  //         <Link to={`/transactions/${row.id}`}>
  //           <button className="invisible">
  //             <img src="/img/eye_2.svg" alt="" width="20"/>
  //           </button>
  //         </Link>
  //       </ActionsWrapper>
  //     );
  //   },
  // }
];

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      results: [],
      transactions: [],
      pagination: {
        total: 0,
        pageSize: 0,
        previous: [],
        query: {},
      },
    };

    this.mode = this.props.mode || 'full';
    this.columns = columns.filter(e => e.groups.indexOf(this.mode) > -1);
    this.paginationHandler = this.paginationHandler.bind(this);
    this.fetch = this.fetch.bind(this);
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
              after: this.state.transactions[this.state.transactions.length - 1].txid,
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
    .getTransactions(this.state.pagination.query)
    .then((data) => {
      let transactions = data.cursor.data;

      let filter = this.props.filter;

      if (this.props.id) {
        filter = (e => e.txid === this.props.txid);
      }

      if (filter) {
        transactions = transactions.filter(filter);
      }

      const results = []

      transactions.forEach(tx => {
        tx.postings.forEach((e, i) => {
          let t = JSON.parse(JSON.stringify(tx));
          t = {
            ...t,
            ...e,
            postingId: i,
          };

          results.push(t);
        })
      });
      
      this.setState({
        ready: true,
        results: data.cursor.data,
        transactions: results,
        pagination: {
          ...this.state.pagination,
          total: data.cursor.total,
          pageSize: data.cursor.page_size,
        }
      });

      window.scroll(0, 0);
    })
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Wrapper>
        <Panel nopad>
          <Table
            columns={this.columns}
            data={this.state.transactions}
            getRowProps={row => {
              return {
                level: row.original.postingId == 0 ? '0' : '1',
                group: row.original.txid % 2 == 0 ? 'even' : 'odd',
              };
            }}
            empty={
              <div>
                {this.state.ready && (
                  <span>No transactions yet</span>
                )}
                {!this.state.ready && (
                  <span>Loading</span>
                )}
              </div>
            }></Table>
        </Panel>
        {this.props.paginate && (
          <Pagination
            total={this.state.pagination.total}
            previous={this.state.pagination.previous.length}
            next={this.state.results.length == this.state.pagination.pageSize}
            handler={this.paginationHandler}></Pagination>
        )}
      </Wrapper>
    );
  }
}

export default TransactionsTable;