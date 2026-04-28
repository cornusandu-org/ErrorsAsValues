export class Expected<T, E> {
    private success: boolean;
    private value: T | E;
    
    private constructor(value: T | E, success: boolean) {
        this.success = success;
        this.value = value;
    }

    static ok<T>(value: T): Expected<T, never> {
        return new Expected<T, never>(value, true);
    }

    static fail<E> (err: E): Expected<never, E> {
        return new Expected<never, E>(err, false);
    }

    onError(fn: (e: E, h: (a: T) => void) => void): T | undefined {
        if (!this.success) {
            let value = undefined;
            fn(this.value as E, a => {value = a});
            return value;
        } else {
            return this.value as T;
        }
    }

    static run<T, E>(fn: (...args: unknown[]) => T | Expected<T, E>, args?: any[],  errorType?: new (...args: any[]) => E): Expected<T, E> {
        if (!args)
            args = [];
        try {
            const r = fn(...args);
            if (r instanceof Expected) {
                return r;
            } else {
                return new Expected<T,E>(r as T, true);
            }
        } catch (e) {
            if (errorType === undefined)
                return new Expected<T,E>(e as E, false);

            if (e instanceof errorType)
                return new Expected<T,E>(e as E, false);

            throw e;
        }
    }

    static getValueUnsafe<T>(expected: Expected<T, any>): T {
        return expected.onError((e) => {throw e}) as T;
    }
}

export function throwError(e: unknown) {
    throw e;
}
