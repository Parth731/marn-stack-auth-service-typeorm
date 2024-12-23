import { expressjwt } from 'express-jwt';
import { Request } from 'express';
import { AuthCookies } from '../types';

export default expressjwt({
  secret: process.env.REFRESH_TOKEN_SECRET!,
  algorithms: ['HS256'],
  // get refresh token
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookies;

    return refreshToken;
  },
});
