import React, { FunctionComponent, useState } from 'react';
import { LoadingButton, Modal as SbModal } from '@numaryhq/storybook';
import { ModalProps } from './types';

const Modal: FunctionComponent<ModalProps> = ({ children, modal, button }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const actions = modal.actions
    ? {
        ...modal.actions,
        cancel: { ...modal.actions.cancel, onClick: handleClose },
      }
    : undefined;

  return (
    <>
      <LoadingButton {...button} onClick={handleOpen} />
      <SbModal
        {...modal}
        open={open}
        onClose={handleClose}
        actions={actions as any} // todo fix any
      >
        {children}
      </SbModal>
    </>
  );
};

export default Modal;
