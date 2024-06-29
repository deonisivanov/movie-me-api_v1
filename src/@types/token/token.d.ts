export {};

declare global {
  interface JwtPayload {
    sub: string;
    exp: number;
    jti: string;
  }

  interface AccessTokenPayload {
    id: string;
    verified: boolean;
  }

  interface AuthenticatedUserInfo {
    id: string;
  }

  type RefreshTokenPayload = {};
}
