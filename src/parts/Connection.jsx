import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import styled from 'styled-components';
import {opts, setOpts} from '../lib/ledger';

const Wrapper = styled.div`
`;

export default function Connection() {
  const [state, setState] = React.useState({});

  const handleChange = (e, group) => {
    if (group) {
      setState({
        ...state,
        [group]: {
          ...state[group],
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <Wrapper>
      <div>
        <h2 className="mt40 mb20">Connection</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          setOpts(state);
        }}>
          <div>
            <label htmlFor="" className="mr20">Cluster URI</label>
            <TextField
              size="small"
              variant="outlined"
              name="uri"
              defaultValue={opts.uri}
              onChange={handleChange}/>
          </div>
          <div className="mt20 mb20">
            <Box sx={{display: 'flex'}}>
              <div>
                <label htmlFor="" className="mr20">Basic Auth Username</label>
                <TextField
                  size="small"
                  variant="outlined"
                  name="username"
                  defaultValue={opts.auth ? opts.auth.username : ''}
                  onChange={e => handleChange(e, "auth")}/>
              </div>
              <div className="ml20">
                <label htmlFor="" className="mr20">Basic Auth Password</label>
                <TextField
                  size="small"
                  variant="outlined"
                  type="password"
                  name="password"
                  autoComplete={'false'}
                  defaultValue={opts.auth ? opts.auth.password : ''}
                  onChange={e => handleChange(e, "auth")}/>
                </div>
            </Box>
          </div>
          <Button
            type="submit"
            disableRipple={true}
            variant="contained"
            color="secondary">Save</Button>
        </form>
      </div>
    </Wrapper>
  );
}