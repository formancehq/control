import * as React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Balances from '../components/BalancesTable.jsx';
import Volumes from '../components/VolumesTable.jsx';
import ledger from '../lib/ledger';

const Wrapper = styled.div`
  h1 {
    font-family: 'Roboto Mono', monospace;
  }

  h2 {
    font-weight: 400;
  }
`;

function Account() {
  const {id} = useParams();

  const [data, setData] = React.useState({});

  React.useEffect(() => {
    ledger()
    .getAccount(id)
    .then(account => {
      setData({
        account,
      });
    });
  }, []);

  return (
    <Wrapper>
      <div className="top-container">
        <h1>{id}</h1>
        {data.account && (
          <div>
            <div className="row">
              <div className="f1 pad-right-20 ">
                <h2>Balances</h2>
                <Balances
                  balances={data.account.balances}></Balances>
              </div>
              <div className="f1 pad-left-20">
                <h2>Volumes</h2>
                <Volumes
                  volumes={data.account.volumes}></Volumes>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default Account;