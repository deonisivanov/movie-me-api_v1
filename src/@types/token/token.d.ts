export {};

declare global {
  interface JwtPayload {
    sub: string;
    exp: number;
    jti: string;
    verified?: boolean;
  }

  interface AccessTokenPayload {
    verified: boolean;
  }

  type RefreshTokenPayload = {};

  interface QueryTokenOauth2 {
    token: string;
  }
}
