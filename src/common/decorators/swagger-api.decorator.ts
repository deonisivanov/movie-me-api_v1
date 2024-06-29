import { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface SwaggerResponseOptions<T = unknown, K = unknown> {
  operation: string;
  params?: string[];
  notFound?: string;
  badRequest?: string | string[];
  body?: Type<T>;
  response?: Type<K> | K;
}

export function SwaggerResponse<T = unknown, K = unknown>(options_: SwaggerResponseOptions<T, K>) {
  const options: SwaggerResponseOptions<T, K> = { ...options_ };
  const decsToApply: Array<ReturnType<typeof applyDecorators>> = [ApiOperation({ summary: options.operation })];

  if (options.params) {
    for (const parameter of options.params) {
      decsToApply.push(ApiParam({ name: parameter, required: true, type: String }));
    }
  }

  if (options.badRequest) {
    const badRequestDescriptions = Array.isArray(options.badRequest) ? options.badRequest : [options.badRequest];
    badRequestDescriptions.forEach((description) => {
      decsToApply.push(ApiResponse({ status: 400, description }));
    });
  }

  if (options.notFound) {
    decsToApply.push(ApiResponse({ status: 404, description: options.notFound }));
  }

  if (options.body) {
    decsToApply.push(ApiBody({ type: options.body }));
  }

  if (options.response) {
    if (typeof options.response === 'function') {
      decsToApply.push(ApiResponse({ type: options.response }));
    } else {
      decsToApply.push(ApiResponse({ schema: { example: options.response } }));
    }
  }

  return applyDecorators(...decsToApply);
}
