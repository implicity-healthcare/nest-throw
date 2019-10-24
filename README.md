# Nest Throws

This utility provide you a decorators to map errors from your NEST controller method.  

## Install

`npm install --save @implicity/nest-throw`

## Usage

### Default use case

From your custom controller :

```typescript
class ControllerA {
    get() {
        try {
            // find data
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
```

You can now use the `Throws` decorator, by default it will map an `InternalServerErrorException` 

```typescript
class ControllerA {
    @Throws()
    get() {
        // find data
    }
}
```

### Classic use case

From your custom controller :

```typescript
class ControllerA {
    get() {
        try {
            // find data
        } catch (e) {
            if (e instanceof MyCustomErrorA)
                throw new ConflictException(e);
            if (e instanceof MyCustomErrorB)
                throw new NotFoundException(e);
            throw InternalServerErrorException(e);
        }
    }
}
```

You can now use the `Throws` decorator.
  

```typescript
class ControllerA {
    @Throws({
        [MyCustomErrorA.name]: ConflictException,
        [MyCustomErrorB.name]: NotFoundException
    })
    get() {
        // find data
    }
}
```

If `MyCustomErrorA` is throws, it will be mapped on `ConflictException`

If `MyCustomErrorB` is throws, it will be mapped on `NotFoundException`

Others will be mapped on `InternalServerErrorException`

### Advanced use case

From your custom controller :

```typescript
class ControllerA {
    get() {
        try {
            // find data
        } catch (e) {
            if (e instanceof MyCustomErrorA) {
                console.log('Show me what you got.');
                throw new ConflictException(e);            
            }
            if (e instanceof MyCustomErrorB)
                throw new NotFoundException(e);
            throw InternalServerErrorException(e);
        }
    }
}
```

You can now use the `Throws` decorator.

```typescript
class HTTPExceptionFactory implements IHttpExceptionFactory {
    public create(e) {
        console.log('Show me what you got.');
        return new ConflictException(e);
    }
}

class ControllerA {
    @Throws({
        [MyCustomErrorA.name]: HTTPExceptionFactory,
        [MyCustomErrorB.name]: NotFoundException
    })
    get() {
        // find data
    }
}
```

If `MyCustomErrorA` is throws, it will be mapped on `HTTPExceptionFactory` and then call the `create` method. Here you can customize your business rules related to the error.

If `MyCustomErrorB` is throws, it will be mapped on `NotFoundException`

Others will be mapped on `InternalServerErrorException`

