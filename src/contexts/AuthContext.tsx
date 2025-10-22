import { createContext, useContext, ReactNode } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { apiRequest } from '@/config/authConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    name?: string;
    email?: string;
    username?: string;
  } | null;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || null);

  const isAuthenticated = !!account;
  const isLoading = inProgress !== InteractionStatus.None;

  const user = account ? {
    name: account.name,
    email: account.username,
    username: account.username,
  } : null;

  const login = () => {
    instance.loginRedirect({
      scopes: apiRequest.scopes,
    });
  };

  const logout = () => {
    instance.logoutRedirect();
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!account) return null;

    try {
      const response = await instance.acquireTokenSilent({
        scopes: apiRequest.scopes,
        account: account,
      });
      return response.accessToken;
    } catch (error) {
      console.error('Error acquiring token silently:', error);
      try {
        const response = await instance.acquireTokenPopup({
          scopes: apiRequest.scopes,
          account: account,
        });
        return response.accessToken;
      } catch (popupError) {
        console.error('Error acquiring token via popup:', popupError);
        return null;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        getAccessToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
