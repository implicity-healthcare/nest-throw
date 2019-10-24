import { HttpException } from '@nestjs/common';

export interface IConstructable<t> {
    new(message): t;
}

export interface IHttpExceptionFactory {
    create(e: Error): HttpException;
}

export interface IErrorsMapper {
    [key: string]: IConstructable<HttpException | IHttpExceptionFactory>;
}
