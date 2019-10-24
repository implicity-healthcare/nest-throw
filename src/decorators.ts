import { IConstructable, IErrorsMapper, IHttpExceptionFactory } from './interfaces';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const Throws = (errorsMapper: IErrorsMapper = {}) => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const { value: scope } = descriptor;
        descriptor.value = async function (...args) {
            try {
                return await scope.apply(this, args);
            } catch (error) {
                const classError: IConstructable<HttpException | IHttpExceptionFactory> = errorsMapper[error.constructor.name];
                if (classError) {
                    const message = error.message && error.message.message ? error.message.message : error.message;
                    const mappedError = new classError(message);

                    if (mappedError instanceof HttpException) {
                        throw mappedError;
                    }

                    throw mappedError.create(error);
                }
                throw new InternalServerErrorException(error && error.message);
            }
        };
    };
};
