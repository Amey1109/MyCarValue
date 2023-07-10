import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(); //* Gives underlying request that is coming to our application
    return request.CurrentUser;
  },
);
