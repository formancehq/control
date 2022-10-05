import React from "react";

export function useOpen(
  defaultValue = false
): [boolean, () => void, () => void] {
  const [open, setOpen] = React.useState(defaultValue);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return [open, handleOpen, handleClose];
}
