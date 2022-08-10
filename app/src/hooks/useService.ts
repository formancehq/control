import { useContext } from 'react';
import { ServiceContext } from '../contexts/service';

export function useService(): ServiceContext {
  return useContext(ServiceContext);
}
