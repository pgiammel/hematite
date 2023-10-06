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

  await t.step("andThen", async (t) => {
    await t.step("Ok(data), fn <Ok(otherData)> => Ok(otherData)", () => {
      const data = "Hello";
      const func = (s: string) => Result.Ok(s.length);
      const result = Result.Ok(data).andThen(func);
      const expected = func(data);

      assertInstanceOf(expected, Ok<number, unknown>);
      assertInstanceOf(result, Ok<number, unknown>);
      assertEquals(result.unwrap(), expected.unwrap());
    });

    await t.step("Ok(data), fn <Err(otherError)> => Err(otherError)", () => {
      const data = "Hello";
      const func = (_: string) => Result.Err(-1);
      const result =
          Result.Ok<string, number>(data).andThen(func);
      const expected = func(data);

      assertInstanceOf(expected, Err<unknown, number>);
      assertInstanceOf(result, Err<unknown, number>);
      assertEquals(result.unwrapErr(), expected.unwrapErr());
    });

    await t.step("Err(error), fn <Ok(otherData)> => Err(error)", () => {
      const error = false;
      const func = (s: string) => Result.Ok<number, boolean>(s.length);
      const result = Result.Err<string, boolean>(error).andThen(func);

      assertInstanceOf(result, Err<number, boolean>);
      assertEquals(result.unwrapErr(), error);
    });

    await t.step("Err(error), fn <Err(otherError)> => Err(error)", () => {
      const error = false;
      const func = (_: string) => Result.Err<number, boolean>(true);
      const result = Result.Err<string, boolean>(error).andThen(func);

      assertInstanceOf(result, Err<unknown, boolean>);
      assertEquals(result.unwrapErr(), error);
    });
  });

  await t.step("err", async (t) => {
    await t.step("Ok(_) => None", () => {
      const result = Result.Ok("Hello").err();

      assertInstanceOf(result, None<unknown>);
    });

    await t.step("Err(error) => Some(error)", () => {
      const error = -1;
      const result = Result.Err(error).err();

      assertInstanceOf(result, Some<number>);
      assertEquals(result.unwrap(), error);
    });
  });

  await t.step("flatten", async (t) => {
    await t.step("Ok(Ok(data)) => Ok(data)", () => {
      const data = "Hello";
      const result = Result.Ok(Result.Ok(data)).flatten();

      assertInstanceOf(result, Ok<string, unknown>);
      assertEquals(result.unwrap(), data);
    });

    await t.step("Ok(Err(innerError)) => Err(innerError)", () => {
      const innerError = -1;
      const result = Result.Ok(Result.Err(innerError)).flatten();

      assertInstanceOf(result, Err<unknown, number>);
      assertEquals(result.unwrapErr(), innerError);
    });

    await t.step("Err(error) => Err(error)", () => {
      const error = -1;
      const result =
          Result.Err<Result<unknown, number>, number>(error).flatten();

      assertInstanceOf(result, Err<unknown, number>);
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

  await t.step("isOkAnd", async (t) => {
    await t.step("Ok(_), fn <true> => true", () => {
      const func = (_: unknown): boolean => true;
      const result = Result.Ok("Hello").isOkAnd(func);

      assertEquals(result, true);
    });

    await t.step("Ok(_), fn <false> => false", () => {
      const func = (_: unknown): boolean => false;
      const result = Result.Ok("Hello").isOkAnd(func);

      assertEquals(result, false);
    });

    await t.step("Err(_), fn <true> => false", () => {
      const func = (_: unknown): boolean => true;
      const result = Result.Err(-1).isOkAnd(func);

      assertEquals(result, false);
    });

    await t.step("Err(_), fn <false> => false", () => {
      const func = (_: unknown): boolean => false;
      const result = Result.Err(-1).isOkAnd(func);

      assertEquals(result, false);
    });
  });

  await t.step("isErrAnd", async (t) => {
    await t.step("Ok(_), fn <true> => false", () => {
      const func = (_: unknown): boolean => true;
      const result = Result.Ok("Hello").isErrAnd(func);

      assertEquals(result, false);
    });

    await t.step("Ok(_), fn <false> => false", () => {
      const func = (_: unknown): boolean => false;
      const result = Result.Ok("Hello").isErrAnd(func);

      assertEquals(result, false);
    });

    await t.step("Err(_), fn <true> => true", () => {
      const func = (_: unknown): boolean => true;
      const result = Result.Err(-1).isErrAnd(func);

      assertEquals(result, true);
    });

    await t.step("Err(_), fn <false> => false", () => {
      const func = (_: unknown): boolean => false;
      const result = Result.Err(-1).isErrAnd(func);

      assertEquals(result, false);
    });
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

  await t.step("mapErr", async (t) => {
    await t.step("Ok(data) => Ok(data)", () => {
      const innerValue = "Hello";
      const func = (_: number) => true;
      const result = Result.Ok<string, number>(innerValue).mapErr(func);

      assertInstanceOf(result, Ok<string, boolean>);
      assertEquals(result.unwrap(), innerValue);
    });

    await t.step("Err(error), fn => Result.Err(fn(error))", () => {
      const error = -1;
      const func = (_: number) => true;
      const result = Result.Err<unknown, number>(error).mapErr(func);

      assertInstanceOf(result, Err<unknown, boolean>);
      assertEquals(result.unwrapErr(), func(error));
    });
  });

  await t.step("mapOr", async (t) => {
    await t.step("Ok(data), defaultValue, fn => fn(data)", () => {
      const data = "Hello";
      const func = (s: string): number => s.length;
      const result = Result.Ok(data).mapOr(-1, func);

      assertEquals(result, func(data));
    });

    await t.step("Err(_), defaultValue, fn => defaultValue", () => {
      const defaultValue = 5;
      const func = (s: string): number => s.length;
      const result = Result.Err<string, number>(-1).mapOr(defaultValue, func);

      assertEquals(result, defaultValue);
    });
  });

  await t.step("mapOrElse", async (t) => {
    await t.step("Ok(data), defaultFn, mapFn => mapFn(data)", () => {
      const data = "Hello";
      const defaultFn = (_: unknown) => -1;
      const mapFn = (s: string) => s.length;
      const result = Result.Ok(data).mapOrElse(defaultFn, mapFn);

      assertEquals(result, mapFn(data));
    });

    await t.step("Err(error), defaultFn, mapFn => defaultFn(error)", () => {
      const error = true;
      const defaultFn = (err: boolean) => Number(err);
      const mapFn = (s: string) => s.length;
      const result =
          Result.Err<string, boolean>(error).mapOrElse(defaultFn, mapFn);

      assertEquals(result, defaultFn(error));
    });
  });

  await t.step("ok", async (t) => {
    await t.step("Ok(data) => Some(data)", () => {
      const data = "Hello";
      const result = Result.Ok(data).ok();

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), data);
    });

    await t.step("Err(_) => None", () => {
      const result = Result.Err(-1).ok();

      assertInstanceOf(result, None<unknown>);
    })
  });

  await t.step("or", async (t) => {
    await t.step("Ok(data), Ok(otherData) => Ok(data)", () => {
      const data = "Hello";
      const result = Result.Ok(data).or(Result.Ok("World"));

      assertInstanceOf(result, Ok<string, unknown>);
      assertEquals(result.unwrap(), data);
    });

    await t.step("Ok(data), Err(otherError) => Ok(data)", () => {
      const data = "Hello";
      const result = Result.Ok(data).or(Result.Err(-1));

      assertInstanceOf(result, Ok<string, unknown>);
      assertEquals(result.unwrap(), data);
    });

    await t.step("Err(error), Ok(otherData) => Ok(otherData)", () => {
      const otherData = "World";
      const result = Result.Err(-1).or(Result.Ok(otherData));

      assertInstanceOf(result, Ok<unknown, number>);
      assertEquals(result.unwrap(), otherData);
    });

    await t.step("Err(error), Err(otherError) => Err(error)", () => {
      const otherError = -2;
      const result = Result.Err(-1).or(Result.Err(otherError));

      assertInstanceOf(result, Err<unknown, number>);
      assertEquals(result.unwrapErr(), otherError);
    });
  });

  await t.step("orElse", async (t) => {
    await t.step("Ok(data), fn <Ok> => Ok(data)", () => {
      const data = "Hello";
      const func = (_: unknown) => Result.Ok("World");
      const result = Result.Ok(data).orElse(func);

      assertInstanceOf(result, Ok<string, unknown>);
      assertEquals(result.unwrap(), data);
    });

    await t.step("Ok(data), fn <Err> => Ok(data)", () => {
      const data = "Hello";
      const func = (_: unknown) => Result.Err<string, number>(-2);
      const result = Result.Ok(data).orElse(func);

      assertInstanceOf(result, Ok<string, number>);
      assertEquals(result.unwrap(), data);
    });

    await t.step("Err(error), fn <Ok> => fn()", () => {
      const error = -1;
      const func = (_: unknown) => Result.Ok("World");
      const result = Result.Err<string, number>(error).orElse(func);
      const expected = func(error);

      assertInstanceOf(expected, Ok<string, unknown>);
      assertInstanceOf(result, Ok<string, number>);
      assertEquals(result.unwrap(), expected.unwrap());
    });

    await t.step("Err(error), fn <Err> => fn()", () => {
      const error = -1;
      const func = (_: unknown) => Result.Err(-2);
      const result = Result.Err(error).orElse(func);
      const expected = func(error);

      assertInstanceOf(expected, Err<unknown, number>);
      assertInstanceOf(result, Err<unknown, number>);
      assertEquals(result.unwrapErr(), expected.unwrapErr());
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
