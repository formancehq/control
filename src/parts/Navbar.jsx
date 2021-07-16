import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 80px;
  box-sizing: border-box;

  height: 80px;

  background: #F5F5F5;
  background: #222;
  color: white;

  .logo {
    a {
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }

  ul {
    font-family: 'Roboto Mono', monospace;
    display: flex;
    list-style-type: none;

    li {
      margin: 16px;
    }
  }

  div:last-child {
    margin-left: auto;
  }
`;

function Navbar() {
  return (
    <Wrapper>
      <div className="logo">
        <Link to="/">
          <img src="/img/numary-square.png" width="32" className="mr10"/>
          {/* <span>Numary</span> */}
          <span>Control</span>
        </Link>
      </div>
      <ul className="ml20">
        <li>
          <Link to="/accounts">
            <span>Accounts</span>
          </Link>
        </li>
        <li>
          <Link to="/transactions">
            <span>Transactions</span>
          </Link>
        </li>
      </ul>
      <div>
        <span>Quickstart</span>
      </div>
    </Wrapper>
  );
}

export default Navbar;