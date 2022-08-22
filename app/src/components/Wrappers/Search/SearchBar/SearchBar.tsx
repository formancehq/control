import {
  AccountBalance,
  CreditCard,
  SearchOutlined,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { Chip, LoadingButton, Search, Txid } from '@numaryhq/storybook';

const onClick = (id: number | string) => id;
type Suggestion<T> = {
  label?: string;
  viewAll: boolean;
  items: T[] | [];
};

const accounts: Suggestion<any> = {
  viewAll: true,
  items: [
    {
      id: 1,
      label: 'world:000679472',
      ledger: 'main-production',
      onClick,
    },
    {
      id: 2,
      label: 'world:000679473',
      ledger: 'production',
      onClick,
    },
    {
      id: 2,
      label: 'world:000679476',
      ledger: 'production',
      onClick,
    },
  ],
};

const transactions: Suggestion<any> = {
  viewAll: true,
  items: [
    {
      id: 1,
      ledger: 'main-production',
      source: 'world:0006',
      label: '1',
      onClick,
    },
    {
      id: 2,
      ledger: 'production',
      source: 'world:0006',
      label: '2',
      onClick,
    },
    {
      id: 3,
      label: '3',
      ledger: 'production',
      source: 'world:0006',
      onClick,
    },
  ],
};

export const SearchBar: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // TODo improve

  const renderChildren = (value: string) => (
    <Box
      sx={{
        overflowY: 'auto',
        display: 'flex',
        width: 800,
        mt: 2,
        borderRadius: '4px',
      }}
    >
      <Box
        p={2}
        sx={{
          width: 60,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: ({ palette }) => palette.neutral[50],
          borderRight: ({ palette }) => `1px solid ${palette.neutral[200]}`,
        }}
      >
        <LoadingButton
          variant="dark"
          startIcon={<AccountBalance />}
          sx={{ width: 50, marginTop: 2 }}
        />
        <LoadingButton
          variant="stroke"
          startIcon={<CreditCard />}
          sx={{ width: 50, marginTop: 2 }}
        />
        <LoadingButton
          variant="stroke"
          content={<Typography variant="bold">R</Typography>}
          sx={{ width: 50, marginTop: 2 }}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.neutral[0],
          width: 740,
          height: 400,
          p: 2,
          overflowY: 'auto',
        }}
      >
        <Typography variant="bold">
          Result for {value} accross ledgers
        </Typography>
        {renderLedger(accounts, 'Account')}
        {renderLedger(transactions, 'Transaction')}
      </Box>
    </Box>
  );

  const renderLedger = (data: any, target: string) => (
    <Box mt={1}>
      {data.items.map((item: any, index: number) => (
        <>
          <Box
            key={index}
            sx={{
              display: 'flex',
              paddingTop: 1,
              paddingBottom: 1,
              columnGap: '100px',
            }}
          >
            <Chip
              label={target === 'Account' ? 'Account' : 'Transaction'}
              color={target === 'Account' ? 'default' : 'blue'}
              variant="square"
            />
            {target === 'Account' ? (
              <Typography>{item.label}</Typography>
            ) : (
              <Box display="inline-flex" alignItems="center">
                <Txid id={item.label} />
                <Typography ml={1}>{item.source}</Typography>
              </Box>
            )}
            <Chip
              label={item.ledger}
              variant="square"
              icon={<AccountBalance fontSize="small" />}
              sx={{ '& .MuiChip-icon': ({ palette }) => palette.neutral[300] }}
            />
          </Box>
        </>
      ))}
      {data.viewAll && (
        <Box display="flex" justifyContent="center" mt={1} mb={1}>
          <LoadingButton content={`View all ${target}`} />
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      <LoadingButton
        id="search"
        startIcon={<SearchOutlined />}
        onClick={handleOpen}
        variant="dark"
      />
      <Search
        open={open}
        onClose={handleClose}
        renderChildren={(value) => renderChildren(value)}
      />
    </Box>
  );
};
export default SearchBar;
