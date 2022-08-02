import { Autocomplete, TextField } from '@mui/material';
import * as React from 'react';
import ledger from '../lib/ledger';
import getLedger from '../lib/ledger';

function Search() {
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('https://api.github.com/users');
      const data = await result.json();
      // setOptions(data);
      const res = await ledger().getAccounts({
        address: `.*${inputValue}.*`,
      });

      setOptions(res.data);
    };
    
    fetchData();
  }, [inputValue]);

  const handleChange = (event, value) => {
    if (!value) {
      return;
    }

    window.location.href = `/accounts/${value.address}`;
  }

  return (
    <Autocomplete
      size="small"
      freeSolo={true}
      options={options}
      value={inputValue}
      onInputChange={(e, v) => setInputValue(v)}
      onChange={handleChange}
      getOptionLabel={(option) => {
        return option.address || inputValue;
      }}
      renderInput={(params) => <TextField {...params} label="search" />}
    />
  )
}

export default Search;