const { expect } = require('chai');

const bootstrap = require('../test_helper');

const route = '/certs';

describe(route, () => {
  before(bootstrap(__dirname));

  describe('when populated with signing keys', () => {
    it('responds with json 200', function () {
      return this.agent.get(route)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          let rsa;
          let ec;

          expect(res.body.keys.length).to.equal(2);

          res.body.keys.forEach((key) => {
            if (key.kty === 'RSA') rsa = key;
            if (key.kty === 'EC') ec = key;
          });

          expect(rsa).to.be.ok;
          expect(ec).to.be.ok;

          expect(rsa).to.have.all.keys(['kty', 'kid', 'e', 'n']);
          expect(ec).to.have.all.keys(['kty', 'kid', 'crv', 'x', 'y']);
        });
    });

    it('does not populate ctx.oidc.entities', function (done) {
      this.provider.use(this.assertOnce((ctx) => {
        expect(ctx.oidc.entities).to.be.empty;
      }, done));

      this.agent.get(route).end(() => {});
    });
  });
});
