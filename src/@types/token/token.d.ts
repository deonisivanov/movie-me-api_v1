export {};

declare global {
  interface JwtPayload {
    sub: string;
    exp: number;
    jti: string;
  }

  interface AccessTokenPayload {
    id: string;
  }

  type RefreshTokenPayload = {};
}
