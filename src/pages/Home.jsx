import * as React from 'react';
import styled from 'styled-components';
import ledger from '../lib/ledger';

const Wrapper = styled.div`
  .stats {
    display: flex;

    .tile {
      width: 280px;
      height: 100px;
      margin: 0 20px;
      padding: 20px;

      background: white;
      border-radius: 8px;

      .count {
        display: block;
        font-family: 'Roboto Mono', monospace;
        font-size: 32px;
      }

      .label {
        font-size: 18px;
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }
`;

function Home() {
  const [data, setData] = React.useState({
    accounts: 0,
    transactions: 0,
  });

  React.useEffect(() => {
    ledger()
    .getStats()
    .then(res => {
      setData({
        ...res.stats,
      })
    });
  }, [])
  return (
    <Wrapper>
      <div className="top-container">
       <div className="stats mt40">
          <div className="tile">
            <span className="count mb10">{data.accounts}</span>
            <span className="label">Accounts</span>
          </div>
          <div className="tile">
            <span className="count mb10">{data.transactions}</span>
            <span className="label">Transactions</span>
          </div>
       </div>
      </div>
    </Wrapper>
  );
}

export default Home;