import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`

  .main {
    height: 80px;
    width: calc(100% - 0px);
    padding: 0 20px;
    box-sizing: border-box;
    margin: auto;
    display: flex;
    align-items: center;

    background: #111;
    color: white;

    .logo {
      a {
        /* color: #222; */
        font-size: 20px;
        font-weight: 600;
        display: flex;
        align-items: center;
      }
    }

    ul.links {
      display: flex;
      list-style-type: none;

      li {
        margin: 16px;
      }
    }

    div.right-links {
      margin-left: auto;
      display: flex;
      align-items: center;
    }

    .search {
      display: none;
      margin-left: 100px;
      width: 300px;

      input {
        display: block;
        width: 100%;
        background: #333;
        color: #EEE;
        &:focus {
          outline: 0;
          border: solid 4px #444;
        }
      }
    }

    /* box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.08); */
    /* border-bottom: solid 2px rgba(0, 0, 0, 0.1); */
  }

  .sub {
  }
`;

function Navbar() {
  return (
    <Wrapper>
      <div className="main">
        <div className="logo">
          <Link to="/">
            <img src="/img/numary-square.png" width="32" className="mr10"/>
            {/* <span>Numary</span> */}
            <span>Control</span>
          </Link>
        </div>
        <ul className="ml20 fw500 opacity-075 links">
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
        <div className="search">
          <input type="text"/>
        </div>
        <div className="right-links">
        </div>
      </div>
      <div className="sub">

      </div>
    </Wrapper>
  );
}

export default Navbar;