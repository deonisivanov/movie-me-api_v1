import type { CanActivate, Type } from '@nestjs/common';
import { applyDecorators,UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards';

interface AuthGuard {
  guards?: Type<CanActivate>[];
  unauthorizedResponse?: string;
}

/**
 * It's a decorator that uses the JwtAuthGuard and PoliciesGuard guards, and returns an unauthorized
 * response if the user is not authenticated
 * @returns A function that returns a function
 */

export function Auth(options_?: AuthGuard) {
  const options = {
    guards: [JwtAuthGuard],
    unauthorizedResponse: 'No auth token in request',
    ...options_
  } satisfies AuthGuard;

  return applyDecorators(
    UseGuards(...options.guards),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: options.unauthorizedResponse })
  );
}
