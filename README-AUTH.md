# Entra ID Authentication Setup

This application uses Microsoft Entra ID (formerly Azure AD) for authentication via MSAL.

## Configuration

Update the following file with your Azure AD app registration details:

### `src/config/authConfig.ts`

1. **Client ID**: Replace `YOUR_CLIENT_ID` with your Application (client) ID from Azure portal
2. **Tenant ID**: Replace `YOUR_TENANT_ID` with your Directory (tenant) ID
3. **API Scopes**: Update `apiRequest.scopes` with your backend API scopes
   - Format: `api://YOUR_API_CLIENT_ID/scope_name`
   - Example: `api://12345678-1234-1234-1234-123456789012/access_as_user`
4. **Backend API URL**: Update `apiConfig.baseUrl` with your backend API base URL

## Azure Portal Configuration

In your Azure AD app registration, ensure:

1. **Redirect URI**: Add `http://localhost:8080` for development
2. **Redirect URI**: Add your production URL (e.g., `https://yourapp.lovable.app`)
3. **API Permissions**: Grant the necessary API scopes
4. **Expose an API**: If your backend requires it, expose API scopes

## Usage

### In Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

### Making API Calls

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const api = useApi();

  const fetchData = async () => {
    try {
      const data = await api.get('/api/endpoint');
      console.log(data);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Token Management

- Tokens are automatically acquired and refreshed
- Access tokens are added to all API requests via the `Authorization` header
- If silent token acquisition fails, a popup will be shown

## Security Notes

- Never commit actual client IDs, tenant IDs, or secrets to version control
- Use environment-specific configuration files for production deployments
- Ensure redirect URIs are properly configured in Azure portal
