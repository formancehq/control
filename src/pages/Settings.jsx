import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import styled from 'styled-components';
import {opts} from '../lib/ledger';
import Connection from '../parts/Connection.jsx';

const Wrapper = styled.div`
`;

export default function Settings() {
  return (
    <Wrapper>
      <div className="top-container mt20 mb40">
        <h1>Settings</h1>
        <Connection></Connection>
      </div>
    </Wrapper>
  );
}