import React, { FunctionComponent } from 'react';
import { ClickAwayListener, Paper } from '@mui/material';
import { LoadingButton } from '@numaryhq/storybook';
import {
  ImportExport,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useOpen } from '~/src/hooks/useOpen';
import { SelectButtonProps } from './types';

const SelectButton: FunctionComponent<SelectButtonProps> = ({
  label,
  children,
}) => {
  const [open, handleOpen, handleClose] = useOpen();

  return (
    <>
      <LoadingButton
        content={label}
        variant="dark"
        startIcon={<ImportExport />}
        endIcon={!open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
        onClick={handleOpen}
      />
      {open && (
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              position: 'relative',
              zIndex: 999,
              marginLeft: 0,
            }}
          >
            {children}
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};
export default SelectButton;
