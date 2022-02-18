import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  form {
    label {
      display: block;
    }
  }
`;

export default function NewTransaction() {
  return (
    <Wrapper>
      <div className="top-container mt20">
        <h1>New Transaction</h1>
        <h2>Postings</h2>
        <form>
          <Box>
            <div className="mb20">
              <label htmlFor="" className="mr20">Source</label>
              <TextField size="small" variant="outlined"/>
            </div>
            <div className="mb20">
              <label htmlFor="" className="mr20">Destination</label>
              <TextField size="small" variant="outlined"/>
            </div>
            <div className="mb20">
              <label htmlFor="" className="mr20">Asset</label>
              <TextField size="small" variant="outlined"/>
            </div>
            <div className="mb20">
              <label htmlFor="" className="mr20">Amount</label>
              <TextField size="small" variant="outlined"/>
            </div>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disableRipple={true}>Commit</Button>
        </form>
        {/* <h2>Metadata</h2>
        <form>
          <Box sx={{display: 'flex'}}>
            <div className="mr20">
              <label htmlFor="" className="mr20">Key</label>
              <TextField size="small" variant="outlined"/>
            </div>
            <div className="mr20">
              <label htmlFor="" className="mr20">Value</label>
              <TextField size="small" variant="outlined"/>
            </div>
          </Box>
        </form>
        <h2>Properties</h2>
        <form>
          <Box sx={{display: 'flex'}}>
            <div className="mr20">
              <label htmlFor="" className="mr20">Reference</label>
              <TextField size="small" variant="outlined"/>
            </div>
          </Box>
        </form> */}
      </div>
    </Wrapper>
  );
}