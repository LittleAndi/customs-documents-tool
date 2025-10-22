import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/lib/api';

export const useApi = () => {
  const { getAccessToken } = useAuth();

  const api = useMemo(() => {
    return new ApiService(getAccessToken);
  }, [getAccessToken]);

  return api;
};
