import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 80px;
  box-sizing: border-box;

  height: 80px;

  background: #F5F5F5;

  .logo {
    font-size: 20px;
    font-weight: 600;
  }

  ul {
    display: flex;
    list-style-type: none;

    li {
      margin: 16px;
    }
  }
`;

function Navbar() {
  return (
    <Wrapper>
      <div className="logo">
        <span>Numary</span>
      </div>
      <ul>
        <li>Accounts</li>
        <li>Transactions</li>
      </ul>
    </Wrapper>
  );
}

export default Navbar;