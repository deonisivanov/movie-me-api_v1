import type { CookieOptions, Request, Response } from 'express';

import type { Config as ConfigInterface } from '@lib';

/* The `export {};` statement is used to indicate that the file is a module and exports nothing. It is
often used in TypeScript files that only contain type declarations or interfaces, without any actual
code or exports. This statement ensures that the file is treated as a module and not as a script. */
export {};

declare global {
  export type Configs = ConfigInterface;

  export type ExpressRequest = Request;
  export type ExpressResponse = Response;
  export type ExpressCookieOptions = CookieOptions;
}
