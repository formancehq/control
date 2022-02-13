import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Addr = styled.div`
  display: inline-block;

  font-family: 'Roboto Mono', monospace;
  font-weight: 400;

  background: #29303D;
  border-radius: 4px;

  &.source {
    background: rgb(254, 118, 118);
    color: rgb(68, 32, 32);
    /* font-weight: 500; */
  }

  &.destination {
    background: rgb(91, 181, 124);
    color: rgb(28, 54, 37);
    /* font-weight: 500; */
  }

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
        <Addr ns={this.state.ns} className={["address", this.props.type].join(' ')}>
          <span>{this.props.data}</span>
        </Addr>
      </Link>
    )
  }
}

export default Address;