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

    div.selector {
      /* margin-left: auto; */
      position: relative;
      padding: 10px;
      background: #343434;
      border: solid 2px #444;
      border-radius: 8px;

      .dropdown {
        position: absolute;
        display: none;
        padding: 10px;
        background: white;
        border-radius: 4px;
        color: #222;
        margin-top: 10px;
        width: 180px;
        min-height: 100px;
        transform: translateX(-100px);
        box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);

        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;

          li {
            /* background: #F5F5F5; */
            padding: 10px;
            padding-left: 0;
            border-bottom: solid 2px #EEE;
          }
        }
      }

      &:hover .dropdown {
        display: block;
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
          <div>
            <div className="selector">
              <span>Quickstart</span>
              <div className="dropdown">
                {/* <div className="fw500 mb10">
                  <span>Ledger selection</span>
                </div> */}
                <ul>
                  <li>
                    <span className="name">Quickstart</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* <div>
            <Link className="button action" to="/new">
              <span class="material-icon">Create</span>
            </Link>
          </div> */}
        </div>
      </div>
      <div className="sub">

      </div>
    </Wrapper>
  );
}

export default Navbar;