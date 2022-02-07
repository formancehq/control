import * as React from 'react';
import styled from 'styled-components';
import {opts} from '../lib/ledger';

const Wrapper = styled.div`
  form {
    label {
      display: inline-block;
      width: 200px;
    }
  }
`;

export default function Settings() {
  return (
    <Wrapper>
      <div className="top-container mt20 mb40">
        <h1>Settings</h1>
        <h2 className="mt40">Connection</h2>
        <form>
          <div>
            <label htmlFor="" className="mr20">Cluster URI</label>
            <input type="text" disabled={true} value={opts.uri}/>
          </div>
          <div className="mt20">
            <label htmlFor="" className="mr20">Username</label>
            <input type="text" disabled={true} value={opts.auth ? opts.auth.username : ''}/>
          </div>
          <div className="mt20">
            <label htmlFor="" className="mr20">Password</label>
            <input type="password" disabled={true} value={opts.auth ? opts.auth.password : ''}/>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}