import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseResolver {
  public wrapSuccess<T>(data?: T) {
    return {
      success: true,
      ...data
    };
  }

  public wrapFail<T>(reason?: string, data?: T) {
    return {
      success: false,
      reason,
      ...data
    };
  }
}
