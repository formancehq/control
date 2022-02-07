import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  
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
            <input type="text" />
          </div>
          <div className="mt20">
            <label htmlFor="" className="mr20">User</label>
            <input type="text" />
          </div>
          <div className="mt20">
            <label htmlFor="" className="mr20">Password</label>
            <input type="text" />
          </div>
          <div className="mt20">
            <button>Try</button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}