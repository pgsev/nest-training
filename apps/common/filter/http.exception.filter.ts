import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    let resultMessage = exception.message;
    try {
      const exceptionResponse = exception.getResponse() as any;
      if (Object.hasOwnProperty.call(exceptionResponse, 'message')) {
        resultMessage = exceptionResponse.message;
      }
    } catch (e) {}
    const errorResponse = {
      code: 400,
      data: null,
      message: resultMessage,
    };
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
