import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
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
          data: data || null,
        };

        return result;
      }),
      catchError((error) => {
        const response = {
          code: error.status,
          name: getReasonPhrase(error.status),
          data: error.response?.message,
        };
        return throwError(() => new HttpException(response, error.status));
      }),
    );
  }
}
