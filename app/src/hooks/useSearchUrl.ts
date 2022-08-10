import { useLocation } from 'react-router-dom';

export function useSearchUrl(): { [k: string]: string } {
  const location = useLocation();

  return Object.fromEntries(new URLSearchParams(location.search));
}
