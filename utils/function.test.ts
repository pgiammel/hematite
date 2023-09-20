import {assertEquals} from "../deps.ts";
import {combine, curry, flip} from "./function.ts";

const functionsByParamCount = [
    (): string => "Hello",
    (n: number): number => n * 2,
    (x: number, y: number): number => x - y,
    (x: number, y: number, z: number): number => (x - y) * z,
] as const;

Deno.test("Function Utilities", async (t) => {
    await t.step("curry", async (t) => {
        // Alternative way to test
        // const stepData
        // : ([(...args: number[]) => number, number[]])[] = [
        //     [functionsByParamCount[1], [3]],
        //     [functionsByParamCount[2], [5, 2]],
        //     [functionsByParamCount[3], [5, 2, 6]],
        // ];
        //
        // await Promise.all(
        //     stepData.map(
        //         ([base, params], idx) => t.step({
        //             name: `function with ${idx} parameters`,
        //             fn: () => {
        //                 const curried = curry(base);
        //                 const curriedResult = params.reduce(
        //                     (fn: any, param) => fn(param),
        //                     curried
        //                 );
        //
        //                 assertEquals(
        //                     base(...params),
        //                     curriedResult,
        //                 );
        //             },
        //             sanitizeOps: false,
        //             sanitizeResources: false,
        //             sanitizeExit: false,
        //         })
        //     ),
        // );


        await t.step("function with single parameter", () => {
            const base = functionsByParamCount[1];
            const curried = curry(base);

            assertEquals(
                base(3),
                curried(3),
            );
        });

        await t.step("function with two parameters", () => {
            const base = functionsByParamCount[2];
            const curried = curry(base);

            assertEquals(
                base(5, 2),
                curried(5)(2),
            );
        });

        await t.step("function with three parameters", () => {
            const base = functionsByParamCount[3];
            const curried = curry(base);

            assertEquals(
                base(5, 2, 6),
                curried(5)(2)(6),
            );
        });
    });

    await t.step("flip", async (t) => {
        await t.step("function with no parameters", () => {
            const base = functionsByParamCount[0];
            const flipped = flip(base);

            assertEquals(
                base(),
                flipped(),
            );
        });

        await t.step("function with single parameter", () => {
            const base = functionsByParamCount[1];
            const flipped = flip(base);

            assertEquals(
                base(3),
                flipped(3),
            );
        });

        await t.step("function with two parameters", () => {
            const base = functionsByParamCount[2];
            const flipped = flip(base);

            assertEquals(
                base(5, 2),
                flipped(2, 5),
            );
        });

        await t.step("function with three parameters", () => {
            const base = functionsByParamCount[3];
            const flipped = flip(base);

            assertEquals(
                base(5, 2, 6),
                flipped(6, 2, 5),
            );
        });
    });

    await t.step("combine", async (t) => {
        await t.step("one function", () => {
            assertEquals(
                combine(functionsByParamCount[1])(3),
                6,
            );
        });

        await t.step("two functions", () => {
            assertEquals(
                combine(
                    functionsByParamCount[1],
                    curry(functionsByParamCount[2])(10), // 10 - y
                )(3),
                4,
            );
        });

        await t.step("three functions", () => {
            assertEquals(
                combine(
                    functionsByParamCount[1],
                    curry(functionsByParamCount[2])(10), // 10 - y
                    (n: number) => n.toFixed(2),
                )(3),
                "4.00",
            );
        });
    });
});