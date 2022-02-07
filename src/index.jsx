import * as React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './global.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { getInfo } from './lib/ledger';
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
import Create from './pages/Create.jsx';
import ScrollToTop from './parts/Scroll.jsx';
import Panel from './parts/Panel.jsx';
import Settings from './pages/Settings.jsx';

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;

  button, a.button {
    display: inline-block;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    padding: 9px 14px;
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

  input[type="text"], input[type="email"] {
    padding: 4px 8px;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    margin-left: 0;
    background: #16191D;
    color: #EEEFF2;

    &:focus {
      outline: solid 2px #474F5C;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
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

  componentWillMount() {
    getInfo()
    .then(() => {
      this.setState({
        ready: true,
      });
    })
    .catch(e => {
      this.setState({
        ready: true,
        error: true,
      });
    });
  }

  render() {
    if (this.state.error) {
      return (
        <Wrapper>
          <Panel>
            <h1>Failed to connect to the ledger</h1>
            <h2 className="opacity-05 fw300">Is the ledger started?</h2>
          </Panel>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Router>
          <ScrollToTop></ScrollToTop>
          <Navbar></Navbar>
          <Switch>
            <Route path="/accounts/:id" exact>
              <Account></Account>
            </Route>
            <Route path="/accounts" exact>
              <Accounts></Accounts>
            </Route>
            <Route path="/transactions" exact>
              <Transactions></Transactions>
            </Route>
            <Route path="/settings" exact>
              <Settings></Settings>
            </Route>
            <Route path="/new" exact>
              <Create></Create>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </Router>
      </Wrapper>
    );
  }
}

const container = document.querySelector('#app');
ReactDOM.render(React.createElement(App), container);