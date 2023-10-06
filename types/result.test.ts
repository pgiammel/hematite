import {
  assertEquals,
  assertExists,
  assertInstanceOf,
  assertThrows,
} from "../deps.ts";
import { Err, Ok, Result } from "./result.ts";
import { None, Some } from "./option.ts";
import { IntoIteratorSymbol } from "../traits/into_iterator.ts";
import { IteratorSymbol } from "../traits/iterator.ts";
import { UnwrapError } from "./error.ts";

Deno.test("Result<T, E>", async (t) => {
  await t.step(
    "Ok",
    () => assertInstanceOf(Result.Ok("Hello"), Ok<string, unknown>),
  );

  await t.step(
    "Err",
    () => assertInstanceOf(Result.Err("Fail"), Err<unknown, string>),
  );

  await t.step("and", async (t) => {
    await t.step("Ok(data), Ok(otherData) => Ok(otherData)", () => {
      const data = "Hello";
      const otherData = 5;
      const result = Result.Ok(data).and(Result.Ok(otherData));

      assertInstanceOf(result, Ok<number, unknown>);
      assertEquals(result.unwrap(), otherData);
    });

    await t.step("Ok(data), Err(otherError) => Err(otherError)", () => {
      const data = "Hello";
      const otherError = false;
      const result =
          Result.Ok<string, boolean>(data).and(Result.Err(otherError));

      assertInstanceOf(result, Err<number, boolean>);
      assertEquals(result.unwrapErr(), otherError);
    });

    await t.step("Err(error), Ok(otherData) => Err(error)", () => {
      const error = false;
      const otherData = 5;
      const result = Result.Err(error).and(Result.Ok(otherData));

      assertInstanceOf(result, Err<number, boolean>);
      assertEquals(result.unwrapErr(), error);
    });

    await t.step("Err(error), Err(otherError) => Err(error)", () => {
      const error = false;
      const otherError = true;
      const result = Result.Err(error).and(Result.Err(otherError));

      assertInstanceOf(result, Err<unknown, boolean>);
      assertEquals(result.unwrapErr(), error);
    });
  });

  await t.step("isOk", async (t) => {
    await t.step(
      "Result.Ok => true",
      () => assertEquals(Result.Ok("Hello").isOk(), true),
    );

    await t.step(
      "Result.Err => false",
      () => assertEquals(Result.Err("Error").isOk(), false),
    );
  });

  await t.step("isErr", async (t) => {
    await t.step(
      "Result.Ok => false",
      () => assertEquals(Result.Ok("Hello").isErr(), false),
    );

    await t.step(
      "Result.Err => true",
      () => assertEquals(Result.Err("Error").isErr(), true),
    );
  });

  await t.step("unwrap", async (t) => {
    await t.step("Ok(data) => data", () => {
      const data = "Hello";

      assertEquals(Result.Ok(data).unwrap(), data);
    });

    await t.step("Err(err) => throws UnwrapError", () => {
      assertThrows(
        () => Result.Err("Fail").unwrap(),
        UnwrapError,
      );
    });
  });

  await t.step("unwrapErr", async (t) => {
    await t.step("Ok(data) => throws UnwrapError", () => {
      assertThrows(
        () => Result.Ok("Hello").unwrapErr(),
        UnwrapError,
      );
    });

    await t.step("Err(err) => err", () => {
      const error = "Fail";

      assertEquals(Result.Err(error).unwrapErr(), error);
    });
  });

  await t.step("map", async (t) => {
    await t.step("Result.Ok => Result.Ok", () => {
      const innerValue = "Hello";
      const func = (s: string) => s.length;
      const result = Result.Ok(innerValue).map(func);

      assertInstanceOf(result, Ok<number, unknown>);
      assertEquals(result.unwrap(), func(innerValue));
    });

    await t.step("Result.Err => Result.Err", () => {
      const error = "Error";
      const func = (s: string) => s.length;
      const result = Result.Err<string, string>(error).map(func);

      assertInstanceOf(result, Err<number, string>);
      assertEquals(result.unwrapErr(), error);
    });
  });

  await t.step("IntoIterator trait", async (t) => {
    await t.step("intoIter", async (t) => {
      await t.step("Result.Ok(data) => Iterator over [data]", () => {
        const result = Result.Ok(5);
        const iter = result[IntoIteratorSymbol]().intoIter();

        assertExists(iter[IteratorSymbol]);

        const iterTraitMethods = iter[IteratorSymbol]();

        const firstItem = iterTraitMethods.next();

        // rest is duplicate from option.test.ts
        // maybe check later if deduplication is needed
        assertInstanceOf(firstItem, Some<number>);
        assertEquals(firstItem.unwrap(), 5);

        const secondItem = iterTraitMethods.next();

        assertInstanceOf(secondItem, None<number>);
      });

      // check that it returns an iterator that will yield no items
      await t.step("Result.Err => Iterator over []", () => {
        const result = Result.Err("Error");
        const iter = result[IntoIteratorSymbol]().intoIter();

        assertExists(iter[IteratorSymbol]);
        assertInstanceOf(iter[IteratorSymbol]().next(), None);
      });
    });
  });
});
