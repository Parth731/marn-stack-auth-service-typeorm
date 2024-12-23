import { expressjwt, GetVerificationKey } from 'express-jwt';
import { Request } from 'express';
import jwksClient from 'jwks-rsa';
import { AuthCookies } from '../types';

export default expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: process.env.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as unknown as GetVerificationKey,
  algorithms: ['RS256'],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    // Bearer eyjllsdjfljlasdjfljlsadjfljlsdf(tocken)
    if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
      const token = authHeader.split(' ')[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookies;
    console.log('accessToken =>', accessToken);
    if (accessToken) {
      return accessToken;
    }
  },
});
