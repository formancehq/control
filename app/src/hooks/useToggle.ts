import React from 'react';

export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = React.useState(initialValue);
  const toggle = () => {
    setValue((v: boolean) => !v);
  };

  return [value, toggle];
}
