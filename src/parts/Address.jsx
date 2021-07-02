import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Addr = styled.div`
  display: inline-block;

  font-family: 'Roboto Mono', monospace;
  /* font-family: 'Inter', sans-serif; */
  font-weight: 300;
  /* font-size: 13px; */

  cursor: pointer;

  span {
    display: inline-block;

    /* border-radius: var(--theme-radius); */
    border-radius: var(--theme-small-radius);
    /* background-color: hsla(189, 89%, 90%, 1); */
    
    background-color: ${props => {
      if (props.ns === 'default' && false) {
        return "hsla(50.36, 88.37%, 82.81%, 1)";
      } else {
        return "hsla(170, 100%, 90%, 1)";
      }
    }};

    color: ${props => {
      if (props.ns === 'default' && false) {
        return "hsla(39.17, 55.91%, 56.9%, 1)";
      } else {
        return "hsla(183, 29%, 40%, 1)";
      }
    }};

    padding: 5px 8px;
  }
`;

class Address extends React.Component {
  constructor(props) {
    super(props);

    const parts = props.data.split(':');

    let ns = 'default';
    if (parts.length > 1) {
      ns = parts[0];
    }

    this.state = {
      ns,
    };
  }
  render() {
    return (
      <Link to={`/accounts/${this.props.data}`}>
        <Addr ns={this.state.ns} className="address">
          <span>{this.props.data}</span>
        </Addr>
      </Link>
    )
  }
}

export default Address;