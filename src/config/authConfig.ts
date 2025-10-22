// MSAL Configuration - Update these values with your Azure AD app registration details
export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // Application (client) ID from Azure portal
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Directory (tenant) ID
    redirectUri: window.location.origin, // Must be registered in Azure portal
  },
  cache: {
    cacheLocation: "sessionStorage", // "sessionStorage" or "localStorage"
    storeAuthStateInCookie: false,
  },
};

// Scopes for ID token and access token
export const loginRequest = {
  scopes: ["User.Read"], // Add your required scopes here
};

// Scopes for API access token
export const apiRequest = {
  scopes: ["api://YOUR_API_CLIENT_ID/access_as_user"], // Update with your API scopes
};

// Backend API configuration
export const apiConfig = {
  baseUrl: "https://your-backend-api.com", // Your backend API base URL
  endpoints: {
    // Add your API endpoints here
    verify: "/api/verify",
    status: "/api/status",
  },
};
