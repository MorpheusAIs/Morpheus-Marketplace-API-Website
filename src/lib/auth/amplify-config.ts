import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_tqCTHoSST',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_APP_URL || ''],
          redirectSignOut: [process.env.NEXT_PUBLIC_APP_URL || ''],
          responseType: 'code',
        }
      }
    }
  }
}, { ssr: true }); 