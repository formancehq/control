import 'core-js/actual';
import "regenerator-runtime/runtime.js";
import * as React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './global.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { getInfo, opts } from './lib/ledger';
import posthog from 'posthog-js';

if (POSTHOG) {
  posthog.init(POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    autocapture: false,
  });

  posthog.capture('control.open');
}

import Navbar from './parts/Navbar.jsx';
import Home from './pages/Home.jsx';
import Transactions from './pages/Transactions.jsx';
import Accounts from './pages/Accounts.jsx';
import Account from './pages/Account.jsx';
import ScrollToTop from './parts/Scroll.jsx';
import Panel from './parts/Panel.jsx';
import Settings from './pages/Settings.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Connection from './parts/Connection.jsx';
import Transaction from './pages/Transaction.jsx';
import NewTransaction from './pages/NewTransaction.jsx';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  palette: {
    mode: 'dark',
    secondary: {
      main: '#333942',
    },
    text: {
      primary: '#CBD0D7',
    },
    background: {
      paper: '#1D2025',
      default: '#1D2025',
    },
  },
});

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;

  button, a.button {
    display: inline-block;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    /* padding: 9px 14px; */
    font-size: 14px;

    &.primary {
      border: solid 2px black;
      border-radius: 100px;
      background: white;
      color: black;
      font-weight: 500;

      background: black;
      color: white;
    }

    &.action {
      background: #13e07e;
      color: #222;
      border-radius: 8px;
      font-weight: 500;
      padding: 12px;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  form {
    label {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
    }
  }

  code {
    font-family: 'Roboto Mono', monospace;
  }

  pre {
    background-color: hsl(218deg 13% 12%);
    width: 100%;
    border-radius: 4px;
    padding: 20px;
    
    code {
      font-size: 14px;
      max-width: 100%;
      word-break: break-all;
    }
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      error: false,
      info: {},
    };
  }

  async componentWillMount() {
    try {
      const info = await getInfo();

      this.setState({
        ready: true,
        info,
      });
    } catch (e) {
      this.setState({
        ready: true,
        error: true,
      });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <ThemeProvider theme={theme}>
          <Wrapper>
          <Panel>
            <div>
              <h1>Failed to connect to the ledger</h1>
              <h2 className="opacity-05 fw300">Is the ledger started on {opts.uri}?</h2>
            </div>
            <div>
              <Connection></Connection>
            </div>
          </Panel>
        </Wrapper>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Wrapper>
        <Router>
          <ScrollToTop></ScrollToTop>
          <Navbar info={this.state.info}></Navbar>
          <Switch>
            <Route path="/accounts/:id" exact>
              <Account></Account>
            </Route>
            <Route path="/accounts" exact>
              <Accounts></Accounts>
            </Route>
            <Route path="/transactions/new" exact>
              <NewTransaction></NewTransaction>
            </Route>
            <Route path="/transactions/:txid" exact>
              <Transaction></Transaction>
            </Route>
            <Route path="/transactions" exact>
              <Transactions></Transactions>
            </Route>
            <Route path="/settings" exact>
              <Settings></Settings>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </Router>
      </Wrapper>
      </ThemeProvider>
    );
  }
}

const container = document.querySelector('#app');
ReactDOM.render(React.createElement(App), container);