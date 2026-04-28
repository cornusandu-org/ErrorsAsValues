# Expected

[![Github Repo](https://img.shields.io/badge/github-repo-blue?logo=github&style=for-the-badge)](https://github.com) [![NPM Package](https://img.shields.io/badge/npm_package-errorsasvaluests-pink?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/errorsasvaluests) ![](https://img.shields.io/badge/language-typescript-orange?style=for-the-badge&logo=typescript) ![](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)

## 1. Making an Expected instance

![Deprecated](https://img.shields.io/badge/status-deprecated-red?style=flat)

#### API
```ts
new Expected<T, E>(value: T | E, success: boolean)
static Expected.ok<T>(value: T);
static Expected.fail<E>(value: E);
```

`T`: The return type

`E`: The error type

#### Example
```ts
function myFunc(): Expected<void, Error> {
    try {
        // do work
        return Expected.ok(void);
    } catch (e) {
        return Expected.fail(e);
    }
}
```

> **Warning:** This API has been deprecated and removed for type safety. The constructor is now privated. Please don't try to use this.

## 2. Wrapping a function

#### API
```ts
static Expected.run<T, E>(fn: (...args: unknown[]) => T | Expected<T, E>,
            args?: any[],
            errorType?: new (...args: any[]) => E): Expected<T, E>
```

`fn`: The function to call

`args?`: What arguments to use, if any.

`errorType?`: The constructor for the error type. If errorType is provided, and the error thrown by the function doesn't match errorType, the error will be propogated outwards rather than returned as a value.

```ts
Expected<T, E>.onError(
    fn: (
        errorValue: E, 
        setReturnValue: (value: T) => void
    ) => void
): T | undefined
```

`fn`: A handler for any occuring errors

`errorValue`: The error value

`setReturnValue`: By default, `onError()` returns undefined and calls your handler if any error occures, otherwise returning the returned value. For your handler to replace the placeholder `undefined`, call `setReturnValue()` with the value you'd like onError to return.

#### Example

```ts
function myFunc(): void {
    throw Error("3");
}

const value = Expected.run(myFunc).onError((e, h) => h(Number(e.message)));  // 3
```

#### Tips
If the function returns an instance of `Expected`, that exact instance will be returned by `run()`.

If the function passed to `run()` returns any other value, it will get wrapped into `Expected.ok(value)`.

If the function passed to `run()` throws an error:
* If no errorType constructor is specified, it will get wrapped into `Expected.fail(error)`
* If an errorType constructor is specified:
    * If the error matches the constructor (runtime type validation), it will get wrapped into `Expected.fail(error)`
    * If the error doesn't match the constructor, it will get re-thrown.
* The library provides a `throwError(e)` function that throws an error, that you can pass to `onError()`. However, you should prefer `getValueUnsafe()` over this to keep code shorter.

## 3. Leaving errors unhandled

#### API

```ts
static Expected.getValueUnsafe<T>(expected: Expected<T, any>): T
```

Returns the value stored within an Expected instance. If `expected` is an `Expected.fail`, then an error will be thrown with the error stored by `expected` (note: it does not have to be an Error instance).

Good for when you *want* your program to crash if a function fails, or if you need to maintain backwards-compatibility with a caller.
