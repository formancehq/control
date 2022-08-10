export const setCurrentLedger = (ledger: string): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('currentLedger', ledger);
  }
};

export const getCurrentLedger = (): string | undefined => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('currentLedger') || undefined;
  }
};

export const removeCurrentLedger = (): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('currentLedger');
  }
};
