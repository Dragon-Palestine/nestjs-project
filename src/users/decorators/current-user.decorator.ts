import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from 'src/util/constants';
import { JWTPayloadType } from 'src/util/types';

// CurrentUser Parameter Decorator
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JWTPayloadType => {
    const request: Request = context.switchToHttp().getRequest();
    return request[CURRENT_USER_KEY];
  },
);
