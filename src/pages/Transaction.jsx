import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import PostingsGraph from '../components/PostingsGraph.jsx';
import TransactionsTable from '../components/TransactionsTable.jsx';
import getLedger, {opts} from '../lib/ledger';
import Connection from '../parts/Connection.jsx';
import TxId from '../parts/TxId.jsx';

const Wrapper = styled.div`
  h1 {
    .txid {
      margin-left: 20px;
      font-weight: 300;
    }
  }
`;

export default function Transaction() {
  const {txid} = useParams();

  const [state, setState] = React.useState({});

  React.useEffect(() => {
    (async () => {
      try {
        const tx = await getLedger().getTransaction(txid);
      
        setState({
          tx,
        });
      } catch (e) {

      }
    })();
  }, [txid]);

  return (
    <Wrapper>
      <div className="top-container mt20 mb40">
        <h1>
          <span>Transaction</span>
          <TxId>{txid}</TxId>
        </h1>
        {state.tx && (
          <>
            <div className="row">
              <h2>Postings</h2>
            </div>
            <TransactionsTable query={{txid}}></TransactionsTable>
            <div className="row">
              <h2>Graph</h2>
            </div>
            <div className="row">
              <PostingsGraph postings={state.tx.postings}></PostingsGraph>
            </div>
            <div className="row">
              <h2>Properties</h2>
            </div>
            <div className="row">
              <pre>
                <code>{JSON.stringify({
                  reference: state.tx.reference,
                  timestamp: state.tx.timestamp,
                  hash: state.tx.hash,
                  metadata: state.tx.metadata,
                }, null, 2)}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
}