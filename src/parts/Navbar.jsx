import { Autocomplete, TextField } from '@mui/material';
import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Search from '../components/Search.jsx';
import { getName, setName } from '../lib/ledger';

const Wrapper = styled.div`
  .main {
    height: 80px;
    width: calc(100% - 0px);
    padding: 0 40px;
    box-sizing: border-box;
    margin: auto;
    display: flex;
    align-items: center;

    background: #16191D;
    color: #EEEFF2;

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
        color: #5D6779;

        a.active {
          color: #EEEFF2;
        }
      }
    }

    div.right-links {
      margin-left: auto;
      display: flex;
      align-items: center;
    }

    .search {
      margin-left: 100px;
      width: 400px;
    }

    /* box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.08); */
    /* border-bottom: solid 2px rgba(0, 0, 0, 0.1); */
  }

  .sub {
  }
`;

function Navbar({info}) {
  return (
    <Wrapper>
      <div className="main">
        <div className="logo">
          <Link to="/">
            <img src="/img/numary-square.png" width="32" className="mr10"/>
            <span>Control</span>
          </Link>
        </div>
        <ul className="ml20 fw500 opacity-075 links">
          <li>
            <NavLink to="/accounts">
              <span>Accounts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions">
              <span>Transactions</span>
            </NavLink>
          </li>
        </ul>
        <div className="search">
          <Search/>
        </div>
        <div className="right-links">
          <Autocomplete
            className="mr20"
            size="small"
            freeSolo={true}
            options={info.ledgers || []}
            defaultValue={getName()}
            sx={{ width: 240 }}
            renderInput={(params) => <TextField variant="outlined" {...params} />}
            onChange={(e, value) => setName(value)}/>
          <Link to="/settings">
            <img src="/img/icons/settings.svg" alt="" />
          </Link>
        </div>
      </div>
      <div className="sub">

      </div>
    </Wrapper>
  );
}

export default Navbar;