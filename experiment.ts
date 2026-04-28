import { Expected, throwError } from "./dist/index.js";

function a(): Expected<number, never> {
    return Expected.ok(1);
}

const av = a().onError(throwError);

console.log(av);  // 1

function b(): number {
    return 2;
}

const bv = Expected.run(b).onError(throwError);

console.log(bv);  // 2

function c(): void {
    throw Error("3");
}

const cv = Expected.run(c).onError(e => console.log(e));  // 3

console.log(cv);

function d(): number {
    return 4;
}

const dv = Expected.getValueUnsafe(Expected.run(d));

console.log(dv);

function e(): Expected<number, never> {
    return Expected.ok(5);
}

const ev = Expected.getValueUnsafe(e());

console.log(ev);

function f(): Expected<never, string> {
    throw 6;
}

try {
    const fv = Expected.run(f, [], String).onError(throwError);
} catch (e) {
    // Because it throws a  number instead of a string, Expected propagates the error instead of returning it since its not an expected error
    console.log(e);
}
