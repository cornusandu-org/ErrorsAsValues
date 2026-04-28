import { exit } from "node:process";
import { Expected, throwError } from "./dist/index.js";

let success = 0;
let fail = 0;

function failTest() {
    console.error(`\x1B[31m\x1B[1m[-] Test ${success + fail + 1} failed.\x1B[0m`);
    fail++;
}

function passTest() {
    console.info(`\x1B[32m\x1b[2m[+] Test ${success + fail + 1} passed.\x1B[0m`)
    success++;
}

function a(): Expected<number, never> {
    return Expected.ok(1);
}

const av = a().onError(throwError);

if (av === 1)
    passTest()
else
    failTest()

function b(): number {
    return 2;
}

const bv = Expected.run(b).onError(throwError);

if (bv === 2)
    passTest();
else
    failTest()

function c(): Error {
    throw Error("3");
}

let ce: any;
const cv = Expected.run(c).onError(e => {
    ce = e;
});

if (cv === undefined && ce instanceof Error && ce.message === "3")
    passTest();
else
    failTest();

function d(): number {
    return 4;
}

try {
    const dv = Expected.getValueUnsafe(Expected.run(d));

    if (dv === 4)
        passTest();
    else
        failTest();
} catch (e) {
    failTest();
}

function e(): Expected<number, never> {
    return Expected.ok(5);
}

try {
    const ev = Expected.getValueUnsafe(e());

    if (ev === 5)
        passTest();
    else
        failTest();

} catch (e) {
    failTest();
}

function f(): Expected<never, string> {
    throw 6;
}

try {
    const fv = Expected.run(f, [], String).onError(throwError);
} catch (e) {
    if (e === 6)
        passTest()
    else
        failTest();
}

function g(): Expected<number, Error> {
    throw new Error("s");
}

try {
    let gv;
    gv = Expected.run(g, []).onError((e, h) => h(7));
    if (gv === 7)
        passTest();
    else
        failTest();
} catch (e) {
    failTest();
}

console.log(`\n\n\n\n${success} tests passed, ${fail} tests failed.`);
if (fail >= 1)
    exit(1);
