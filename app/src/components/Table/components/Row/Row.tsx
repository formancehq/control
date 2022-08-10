import { TableCell, TableRow, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { FunctionComponent } from 'react';
import { RowProps } from './types';

const Row: FunctionComponent<RowProps> = ({
  item,
  keys,
  renderActions,
  sx,
}) => {
  const pSx = sx || {};

  const styles = {
    whiteSpace: 'nowrap',
    width: '350px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...pSx,
  } as SxProps<Theme>;

  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
      key={item}
      data-testid={item.id}
    >
      <>
        {/*Eslint rule skipped but in control*/}
        {/*eslint-disable-next-line*/}
        {keys.map((key: any, index) => {
          if (typeof key === 'function') {
            return (
              <TableCell key={index} sx={styles}>
                {key(item)}
              </TableCell>
            );
          } else {
            if (typeof key === 'object') {
              return (
                <TableCell key={index} sx={styles}>
                  {key}
                </TableCell>
              );
            } else {
              return (
                <TableCell key={index}>
                  <Typography variant="body1" sx={styles}>
                    {item[key]}
                  </Typography>
                </TableCell>
              );
            }
          }
        })}
        {renderActions && <TableCell>{renderActions()}</TableCell>}
      </>
    </TableRow>
  );
};
export default Row;
