module.exports = function getSessionHandler(provider) {
  return async function sessionHandler(ctx, next) {
    ctx.oidc.session = await provider.Session.get(ctx);

    await next();

    if (ctx.oidc.session.transient) {
      const sessionCookieName = provider.cookieName('session');
      ctx.response.get('set-cookie').forEach((cookie, index, ary) => {
        if (cookie.startsWith(sessionCookieName) && !cookie.includes('expires=Thu, 01 Jan 1970')) {
          ary[index] = cookie.replace(/(; ?expires=([\w\d:, ]+))/, ''); // eslint-disable-line no-param-reassign
        }
      });
    }

    if (!ctx.oidc.session.destroyed) await ctx.oidc.session.save();
  };
};
