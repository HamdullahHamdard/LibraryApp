export const OktaConfig = {
    clientId: '0oai42k9bvLOgsnNU5d7',
    issuer: 'https://dev-62652784.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}