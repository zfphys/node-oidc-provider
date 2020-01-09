const cloneDeep = require('lodash/cloneDeep');
const merge = require('lodash/merge');

const config = cloneDeep(require('../default.config'));

config.whitelistedJWA.requestObjectSigningAlgValues = config.whitelistedJWA.requestObjectSigningAlgValues.filter((alg) => alg !== 'none');

merge(config.features, {
  pushedAuthorizationRequests: { enabled: true },
});

module.exports = {
  config,
  clients: [{
    client_id: 'client',
    client_secret: 'secret',
    request_object_signing_alg: 'HS256',
    redirect_uris: ['https://rp.example.com/cb'],
  }, {
    client_id: 'client-none',
    request_object_signing_alg: 'RS256',
    redirect_uris: ['https://rp.example.com/cb'],
    token_endpoint_auth_method: 'none',
    jwks_uri: 'https://rp.example.com/jwks',
  }],
};
