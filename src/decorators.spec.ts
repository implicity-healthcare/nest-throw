import { Throws } from './decorators';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IHttpExceptionFactory } from './interfaces';

class ErrorA extends Error {}
class ErrorB extends Error {}

class HTTPExceptionFactory implements IHttpExceptionFactory {
    public create(e) {
        return new ConflictException({ message: { ...e } });
    }
}

class Testable {
    @Throws()
    public async rejectDefaultErrorFromUnknownError() {
        return Promise.reject(new Error());
    }

    @Throws({
        [ErrorA.name]: NotFoundException,
    })
    public async rejectDefaultErrorFromCustomUnknownError() {
        return Promise.reject(new ErrorB());
    }

    @Throws({
        [ErrorA.name]: NotFoundException,
    })
    public async rejectNotFoundExceptionFromMappedCustomError() {
        return Promise.reject(new ErrorA());
    }

    @Throws({
        [ErrorA.name]: NotFoundException,
        [ErrorB.name]: ConflictException,
    })
    public async rejectConflictExceptionFromMappedCustomError() {
        return Promise.reject(new ErrorB());
    }

    @Throws({
        [ErrorA.name]: NotFoundException,
    })
    public async fulfilled() {
        return Promise.resolve(1);
    }

    @Throws({
        [InternalServerErrorException.name]: HTTPExceptionFactory,
    })
    public async rejectConflictExceptionFromMappedHTTPExceptionFactory() {
        return Promise.reject(new InternalServerErrorException('fail'));
    }
}

describe('Throws decorator encapsulate a class method to map rejected Errors', () => {
    it('Should reject an InternalServerErrorException because there is notmapped error', async () => {
        const instance = new Testable();

        await expect(instance.rejectDefaultErrorFromUnknownError())
            .rejects
            .toThrowError(InternalServerErrorException);
    });
    it('Should reject an InternalServerErrorException because there is no known mapped error', async () => {
        const instance = new Testable();

        await expect(instance.rejectDefaultErrorFromCustomUnknownError())
            .rejects
            .toThrowError(InternalServerErrorException);
    });
    it('Should reject a NotFoundException from ErrorA mapped error', async () => {
        const instance = new Testable();

        await expect(instance.rejectNotFoundExceptionFromMappedCustomError())
            .rejects
            .toThrowError(NotFoundException);
    });
    it('Should reject a ConflictException from ErrorB mapped error', async () => {
        const instance = new Testable();

        await expect(instance.rejectConflictExceptionFromMappedCustomError())
            .rejects
            .toThrowError(ConflictException);
    });
    it('Should not reject any error', async () => {
        const instance = new Testable();

        await expect(instance.fulfilled())
            .resolves
            .toEqual(1);
    });
    it('Should reject a ConflictException from ErrorB mapped exception factory', async () => {
        const instance = new Testable();

        await expect(instance.rejectConflictExceptionFromMappedHTTPExceptionFactory())
            .rejects
            .toThrowError(ConflictException);
    });
});
