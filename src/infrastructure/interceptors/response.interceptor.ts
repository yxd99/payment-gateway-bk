import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getReasonPhrase } from 'http-status-codes';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const name = getReasonPhrase(statusCode);
        const result = {
          name,
          code: statusCode,
          data: {},
        };
        if (data.isSuccess) {
          result.data = data.getValue();
        } else {
          throw new InternalServerErrorException(data.getError());
        }

        return result;
      }),
      catchError((error) => {
        console.log({ error });

        const response = {
          code: error.status,
          name: getReasonPhrase(error.status),
          data: error.response.message ?? error.response,
        };
        return throwError(() => new HttpException(response, error.status));
      }),
    );
  }
}
