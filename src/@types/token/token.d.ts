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

  interface AuthenticatedUserInfo {
    id: string;
  }

  type RefreshTokenPayload = {};
}
