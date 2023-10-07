import {None, Option, Some} from "../../types/option.ts";
import {assertEquals, assertInstanceOf} from "../../deps.ts";
import {Err, Ok, Result} from "../../types/result.ts";

Deno.test("Option<Result<U, E>>.prototype.transpose", async (t) => {
    await t.step("Some(Ok(value)) => Ok(Some(value))", () => {
        const value = "Hello";
        const result = Option.Some(Result.Ok(value)).transpose();

        assertInstanceOf(result, Ok<Option<string>, unknown>);

        const inner = result.unwrap();

        assertInstanceOf(inner, Some<string>);
        assertEquals(inner.unwrap(), value);
    });

    await t.step("Some(Err(error)) => Err(error)", () => {
        const error = -1;
        const result = Option.Some(Result.Err(error)).transpose();

        assertInstanceOf(result, Err<Option<unknown>, number>);
        assertEquals(result.unwrapErr(), error);
    });

    await t.step("None => Ok(None)", () => {
        const result = Option.None<Result<unknown, unknown>>().transpose();

        assertInstanceOf(result, Ok<Option<unknown>, unknown>);
        assertInstanceOf(result.unwrap(), None<unknown>);
    });
});