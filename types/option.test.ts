import {
  assertEquals,
  assertExists,
  assertInstanceOf,
  assertThrows,
} from "../deps.ts";
import { None, Option, Some } from "./option.ts";
import { IntoIteratorSymbol } from "../traits/into_iterator.ts";
import { IteratorSymbol } from "../traits/iterator.ts";
import { UnwrapError } from "./error.ts";

Deno.test("Option<T>", async (t) => {
  await t.step("Some", () => assertInstanceOf(Option.Some("Hello"), Some));

  await t.step("None", () => assertInstanceOf(Option.None(), None));

  await t.step("isSome", async (t) => {
    await t.step(
      "Option.Some => true",
      () => assertEquals(Option.Some("Hello").isSome(), true),
    );

    await t.step(
      "Option.None => false",
      () => assertEquals(Option.None().isSome(), false),
    );
  });

  await t.step("isNone", async (t) => {
    await t.step(
      "Option.Some => false",
      () => assertEquals(Option.Some("Hello").isNone(), false),
    );

    await t.step(
      "Option.None => true",
      () => assertEquals(Option.None().isNone(), true),
    );
  });

  await t.step("unwrap", async (t) => {
    await t.step("Some(value) => value", () => {
      const value = "Hello";

      assertEquals(Option.Some(value).unwrap(), value);
    });

    await t.step("None => throws UnwrapError", () => {
      assertThrows(
        () => Option.None().unwrap(),
        UnwrapError,
      );
    });
  });

  await t.step("unwrapOr", async (t) => {
    await t.step("Some(value), defaultValue => value", () => {
      const value = "Hello";

      assertEquals(Option.Some(value).unwrapOr("Fail"), value);
    });

    await t.step("None, defaultValue => defaultValue", () => {
      const defaultValue = "Hello";

      assertEquals(Option.None().unwrapOr(defaultValue), defaultValue);
    });
  });

  await t.step("unwrapOrElse", async (t) => {
    await t.step("Some(value), fn => value", () => {
      const value = "Hello";
      const func = () => "World";
      const result = Option.Some(value).unwrapOrElse(func);

      assertEquals(result, value);
    });

    await t.step("Option.None, fn => fn()", () => {
      const func = () => "World";
      const result = Option.None().unwrapOrElse(func);

      assertEquals(result, func());
    });
  });

  await t.step("map", async (t) => {
    await t.step("Option.Some(value) => Option.Some(func(value))", () => {
      const value = "Hello";
      const func = (s: string) => s.length;
      const result = Option.Some(value).map(func);

      assertInstanceOf(result, Some<number>);
      assertEquals(result.unwrap(), func(value));
    });

    await t.step("Option.None => Option.None", () => {
      const func = (s: string) => s.length;
      const result = Option.None<string>().map(func);

      assertInstanceOf(result, None<number>);
    });
  });

  await t.step("map_or", async (t) => {
    await t.step("Option.Some(value) => func(value)", () => {
      const value = "Hello";
      const func = (s: string) => s.length;
      const result = Option.Some(value).mapOr(0, func);

      assertEquals(result, func(value));
    });

    await t.step("Option.None => defaultValue", () => {
      const defaultValue = 0;
      const func = (s: string) => s.length;
      const result = Option.None<string>().mapOr(defaultValue, func);

      assertEquals(result, defaultValue);
    });
  });

  await t.step("map_or_else", async (t) => {
    await t.step("Option.Some(value) => mapFunc(value)", () => {
      const value = "Hello";
      const mapFunc = (s: string) => s.length;
      const defaultFunc = () => 0;
      const result = Option.Some(value).mapOrElse(
        defaultFunc,
        mapFunc,
      );

      assertEquals(result, mapFunc(value));
    });

    await t.step("Option.None => defaultFunc()", () => {
      const defaultFunc = () => 0;
      const mapFunc = (s: string) => s.length;
      const result = Option.None<string>().mapOrElse(
        defaultFunc,
        mapFunc,
      );

      assertEquals(result, defaultFunc());
    });
  });

  await t.step("and", async (t) => {
    await t.step(
      "Option.Some(value) & Option.Some(otherValue) => Option.Some(otherValue)",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.Some(value).and(Option.Some(otherValue));

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), otherValue);
      },
    );

    await t.step(
      "Option.Some(value) & Option.None => Option.None",
      () => {
        const value = "Hello";
        const result = Option.Some(value).and(Option.None());

        assertInstanceOf(result, None<string>);
      },
    );

    await t.step(
      "Option.None & Option.Some(otherValue) => Option.None",
      () => {
        const otherValue = "Hello";
        const result = Option.None().and(Option.Some(otherValue));

        assertInstanceOf(result, None<string>);
      },
    );

    await t.step(
      "Option.None & Option.None => Option.None",
      () => {
        const result = Option.None().and(Option.None());

        assertInstanceOf(result, None<string>);
      },
    );
  });

  await t.step("and_then", async (t) => {
    await t.step("Option.Some(value) => func(value) <Option.Some>", () => {
      const value = "Hello";
      const func = (s: string) => Option.Some(s.length);
      const result = Option.Some(value).andThen(func);
      const expected = func(value);

      assertInstanceOf(expected, Some<number>);
      assertInstanceOf(result, Some<number>);

      assertEquals(result.unwrap(), expected.unwrap());
    });

    await t.step("Option.Some(value) => func(value) <Option.None>", () => {
      const value = "Hello";
      const func = (s: string) => Option.None<number>();
      const result = Option.Some(value).andThen(func);
      const expected = func(value);

      assertInstanceOf(expected, None<number>);
      assertInstanceOf(result, None<number>);
    });

    await t.step(
      "Option.None, func(value) <Option.Some> => Option.None",
      () => {
        const func = (s: string) => Option.Some<number>(s.length);
        const result = Option.None<string>().andThen(func);

        assertInstanceOf(result, None<number>);
      },
    );

    await t.step(
      "Option.None, func(value) <Option.None> => Option.None",
      () => {
        const func = (_s: string) => Option.None<number>();
        const result = Option.None<string>().andThen(func);

        assertInstanceOf(result, None<number>);
      },
    );
  });

  await t.step("filter", async (t) => {
    await t.step("Some(value), fn <true> => Some(value)", () => {
      const value = "Hello";
      const func = (s: string): boolean => true;
      const result = Option.Some(value).filter(func);

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), value);
    });

    await t.step("Some(value), fn <false> => None", () => {
      const value = "Hello";
      const func = (s: string): boolean => false;
      const result = Option.Some(value).filter(func);

      assertInstanceOf(result, None<string>);
    });

    await t.step("None, fn <true> => None", () => {
      const func = (_: unknown): boolean => true;
      const result = Option.None().filter(func);

      assertInstanceOf(result, None);
    });

    await t.step("None, fn <false> => None", () => {
      const func = (_: unknown): boolean => false;
      const result = Option.None().filter(func);

      assertInstanceOf(result, None);
    });
  });

  await t.step("flatten", async (t) => {
    await t.step("Some(Some(value)) => Some(value)", () => {
      const value = "Hello";
      const result = Option.Some(Option.Some(value)).flatten();

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), value);
    });

    await t.step("Some(None) => None", () => {
      const result = Option.Some(Option.None()).flatten();

      assertInstanceOf(result, None);
    });

    await t.step("None => None", () => {
      const result = Option.None<Option<unknown>>().flatten();

      assertInstanceOf(result, None);
    });
  });

  await t.step("or", async (t) => {
    await t.step(
      "Option.Some(value), Option.Some(otherValue) => Option.Some(value)",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.Some(value).or(Option.Some(otherValue));

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), value);
      },
    );

    await t.step(
      "Option.Some(value), Option.None => Option.Some(value)",
      () => {
        const value = "Hello";
        const result = Option.Some(value).or(Option.None());

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), value);
      },
    );

    await t.step(
      "Option.None, Option.Some(otherValue) => Option.Some(otherValue)",
      () => {
        const otherValue = "World";
        const result = Option.None<string>().or(Option.Some(otherValue));

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), otherValue);
      },
    );

    await t.step("Option.None, Option.None => Option.None", () => {
      const result = Option.None().or(Option.None());

      assertInstanceOf(result, None);
    });
  });

  await t.step("or_else", async (t) => {
    await t.step("Option.Some(value) => Option.Some(value)", () => {
      const value = "Hello";
      const otherValue = "World";
      const func = () => Option.Some(otherValue);
      const result = Option.Some(value).orElse(func);

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), value);
    });

    await t.step("Option.None => func() <Option.Some>", () => {
      const otherValue = "World";
      const func = () => Option.Some(otherValue);
      const result = Option.None<string>().orElse(func);

      assertInstanceOf(result, Some<string>);
      assertEquals(result.unwrap(), otherValue);
    });

    await t.step("Option.None => func() <Option.None>", () => {
      const func = () => Option.None<string>();
      const result = Option.None<string>().orElse(func);

      assertInstanceOf(result, None);
    });
  });

  await t.step("xor", async (t) => {
    await t.step(
      "Option.Some(value), Option.None => Option.Some(value)",
      () => {
        const value = "Hello";
        const result = Option.Some(value).xor(Option.None());

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), value);
      },
    );

    await t.step(
      "Option.None, Option.Some(otherValue) => Option.Some(otherValue)",
      () => {
        const otherValue = "World";
        const result = Option.None<string>().xor(Option.Some(otherValue));

        assertInstanceOf(result, Some<string>);
        assertEquals(result.unwrap(), otherValue);
      },
    );

    await t.step(
      "Option.Some(value), Option.Some(otherValue) => Option.None",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.Some(value).xor(Option.Some(otherValue));

        assertInstanceOf(result, None<string>);
      },
    );

    await t.step("Option.None, Option.None => Option.None", () => {
      const result = Option.None().xor(Option.None());

      assertInstanceOf(result, None);
    });
  });

  await t.step("zip", async (t) => {
    await t.step(
      "Option.Some(value), Option.Some(otherValue) => Option.Some([value, otherValue])",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.Some(value).zip(Option.Some(otherValue));

        assertInstanceOf(result, Some<[string, string]>);
        assertEquals(result.unwrap(), [value, otherValue]);
      },
    );

    await t.step("Option.Some(value), Option.None => Option.None", () => {
      const value = "Hello";
      const result = Option.Some(value).zip(Option.None());

      assertInstanceOf(result, None<[string, unknown]>);
    });

    await t.step("Option.None, Option.Some(otherValue) => Option.None", () => {
      const otherValue = "World";
      const result = Option.None().zip(Option.Some(otherValue));

      assertInstanceOf(result, None<[unknown, string]>);
    });

    await t.step("Option.None, Option.None => Option.None", () => {
      const result = Option.None().zip(Option.None());

      assertInstanceOf(result, None<[unknown, unknown]>);
    });
  });

  await t.step("unzip", async (t) => {
    await t.step(
      "Option.Some([value, otherValue]) => [Option.Some(value), Option.Some(otherValue)]",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.Some<[string, string]>([value, otherValue])
          .unzip();

        assertEquals(Array.isArray(result), true);
        assertEquals(result.length, 2);

        const first = result[0];

        assertInstanceOf(first, Some<string>);
        assertEquals(first.unwrap(), value);

        const second = result[1];

        assertInstanceOf(second, Some<string>);
        assertEquals(second.unwrap(), otherValue);
      },
    );

    await t.step(
      "Option.None => [Option.None, Option.None]",
      () => {
        const result = Option.None<[string, string]>().unzip();

        assertEquals(Array.isArray(result), true);
        assertEquals(result.length, 2);

        const first = result[0];

        assertInstanceOf(first, None<string>);

        const second = result[1];

        assertInstanceOf(second, None<string>);
      },
    );
  });

  await t.step("IntoIterator trait", async (t) => {
    await t.step("intoIter", async (t) => {
      await t.step("Option.Some(value) => Iterator over [value]", () => {
        const option = Option.Some(5);
        const iter = option[IntoIteratorSymbol]().intoIter();

        assertExists(iter[IteratorSymbol]);

        const iterTraitMethods = iter[IteratorSymbol]();

        const firstItem = iterTraitMethods.next();

        assertInstanceOf(firstItem, Some<number>);
        assertEquals(firstItem.unwrap(), 5);

        const secondItem = iterTraitMethods.next();

        assertInstanceOf(secondItem, None<number>);
      });

      await t.step("Option.None => Iterator over []", () => {
        const option = Option.None<number>();
        const iter = option[IntoIteratorSymbol]().intoIter();

        assertExists(iter[IteratorSymbol]);

        const item = iter[IteratorSymbol]().next();

        assertInstanceOf(item, None<number>);
      });
    });
  });
});
