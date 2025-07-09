const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!userPoolClientId) {
  throw new Error("NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID is not set in environment variables.");
}
if (!cognitoDomain) {
    throw new Error("NEXT_PUBLIC_COGNITO_DOMAIN is not set in environment variables.");
}
if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
}

export const config = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_tqCTHoSST',
      userPoolClientId: userPoolClientId,
      loginWith: {
        oauth: {
          domain: cognitoDomain,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [appUrl],
          redirectSignOut: [appUrl],
          responseType: 'code' as const,
        }
      }
    }
  }
}; 