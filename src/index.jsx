import * as React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './global.css';

import Home from './pages/Home.jsx';

import ScrollToTop from './parts/Scroll.jsx';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;

  .top-container {
    padding-left: 80px;
    padding-right: 80px;
  }

  .mt40 {
    margin-top: 40px;
  }

  button, a.button {
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
  }

  input[type="text"], input[type="email"] {
    padding: 12px;
    font-size: 16px;
    border-radius: 100px;
    border: none;
    margin-left: 0;

    /* &:focus {
      outline: none;
      outline: solid 4px rgba(0, 0, 0, 0.2);
    } */
  }

  a {
    text-decoration: none;
    color: initial;
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

  render() {
    return (
      <Wrapper>
        <Router>
          <ScrollToTop></ScrollToTop>
          <Switch>
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