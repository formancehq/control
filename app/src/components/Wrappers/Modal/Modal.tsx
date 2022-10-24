import React, { FunctionComponent, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ModalProps } from './types';

import { LoadingButton, Modal as SbModal } from '@numaryhq/storybook';

const Modal: FunctionComponent<ModalProps> = ({ children, modal, button }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const handleOpen = () => {
    button.onClick && button.onClick();
    setOpen(true);
  };
  const handleClose = async () => {
    if (
      modal &&
      modal.actions &&
      modal.actions.cancel &&
      modal.actions.cancel.onClick
    ) {
      await modal.actions.cancel.onClick();
    }
    setOpen(false);
  };

  const handleSave = async () => {
    if (
      modal &&
      modal.actions &&
      modal.actions.save &&
      modal.actions.save.onClick
    ) {
      await modal.actions.save.onClick();
    }
    await handleClose();
  };
  const actions = modal.actions
    ? {
      ...modal.actions,
      save: {
        ...modal.actions.save,
        onClick: handleSave,
        label: modal.actions.save?.label || t('common.dialog.saveButton'),
      },
      cancel: {
        ...modal.actions.cancel,
        onClick: handleClose,
        label: modal.actions.cancel?.label || t('common.dialog.cancelButton'),
      },
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
