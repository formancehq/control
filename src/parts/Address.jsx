import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Addr = styled.div`
  display: inline-block;

  font-family: 'Roboto Mono', monospace;
  font-weight: 300;

  background: #29303D;
  border-radius: 4px;

  cursor: pointer;

  span {
    display: inline-block;
    border-radius: 4px;
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