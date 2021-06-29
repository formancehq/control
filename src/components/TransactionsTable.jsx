import * as React from 'react';
import styled from 'styled-components'
import * as server from '../lib/ledger';
import Address from '../parts/Address.jsx';
import Asset from '../parts/Asset.jsx';
import Amount from '../parts/Amount.jsx';
import Table from '../parts/Table.jsx';
import TxId from '../parts/TxId.jsx';

import {Link} from 'react-router-dom';
import Panel from '../parts/Panel.jsx';

const Wrapper = styled.div`
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
    accessor: row =>{
      return (
        <TxId>{row.txid}</TxId>
      );
    },
  },
  {
    Header: "Value",
    groups: ['full', 'simple'],
    className: 'left',
    accessor: row => {
      return (
        <div>
          <span>{row.asset} </span>
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
    accessor: () => {
      return new Date().toDateString();
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
      transactions: [],
    };

    this.mode = this.props.mode || 'full';
    this.columns = columns.filter(e => e.groups.indexOf(this.mode) > -1);
  }

  componentDidMount() {
    server
    .getTransactions()
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
        tx.postings.forEach(e => {
          let t = JSON.parse(JSON.stringify(tx));
          t = {
            ...t,
            ...e,
          };
          results.push(t);
        })
      });

      console.log(results);
      
      this.setState({
        ready: true,
        transactions: results,
      });
    })
  }

  render() {
    return (
      <Wrapper>
        <Table
          columns={this.columns}
          data={this.state.transactions}
          empty={
            <div>
              <span>No transactions yet!</span><br/>
              <span>Add your first</span>
            </div>
          }></Table>
          {this.props.paginate && false && (
            <div className="pagination">
              <ul>
                <li className="active">1</li>
                <li>2</li>
                <li>...</li>
                <li>31</li>
              </ul>
            </div>
          )}
      </Wrapper>
    );
  }
}

export default TransactionsTable;