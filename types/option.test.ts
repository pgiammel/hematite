import { assertEquals, assertExists } from "../deps.ts";
import { Option } from "./option.ts";
import { IntoIteratorSymbol } from "../traits/into_iterator.ts";
import { IteratorSymbol } from "../traits/iterator.ts";

Deno.test("Option<T>", async (t) => {
  await t.step("isOption", async (t) => {
    await t.step(
      "Option.Some => true",
      () => assertEquals(Option.isOption(Option.Some("Hello")), true),
    );

    await t.step(
      "Option.None => true",
      () => assertEquals(Option.isOption(Option.None()), true),
    );

    await t.step(
      "string => false",
      () => assertEquals(Option.isOption("Option"), false),
    );

    await t.step(
      "number => false",
      () => assertEquals(Option.isOption(5), false),
    );

    await t.step(
      "boolean => false",
      () => assertEquals(Option.isOption(true), false),
    );

    await t.step(
      "Option<T>[] => false",
      () => assertEquals(Option.isOption([Option.None()]), false),
    );

    await t.step(
      "string[] => false",
      () => assertEquals(Option.isOption(["Hello"]), false),
    );

    await t.step("{} => false", () => assertEquals(Option.isOption({}), false));

    await t.step(
      "null => false",
      () => assertEquals(Option.isOption(null), false),
    );

    await t.step(
      "undefined => false",
      () => assertEquals(Option.isOption(undefined), false),
    );
  });

  await t.step("isSome", async (t) => {
    await t.step(
      "Option.Some => true",
      () => assertEquals(Option.isSome(Option.Some("Hello")), true),
    );

    await t.step(
      "Option.None => false",
      () => assertEquals(Option.isSome(Option.None()), false),
    );
  });

  await t.step("isNone", async (t) => {
    await t.step(
      "Option.Some => false",
      () => assertEquals(Option.isNone(Option.Some("Hello")), false),
    );

    await t.step(
      "Option.None => true",
      () => assertEquals(Option.isNone(Option.None()), true),
    );
  });

  await t.step("map", async (t) => {
    await t.step("Option.Some(value) => Option.Some(func(value))", () => {
      const value = "Hello";
      const func = (s: string) => s.length;
      const result = Option.map(Option.Some(value), func);

      assertEquals(Option.isOption(result), true);

      const isSome = Option.isSome(result);

      assertEquals(isSome, true);
      assertEquals(isSome && result.value, func(value));
    });

    await t.step("Option.None => Option.None", () => {
      const func = (s: string) => s.length;
      const result = Option.map(Option.None<string>(), func);

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });
  });

  await t.step("map_or", async (t) => {
    await t.step("Option.Some(value) => func(value)", () => {
      const value = "Hello";
      const func = (s: string) => s.length;
      const result = Option.map_or(Option.Some(value), 0, func);

      assertEquals(result, func(value));
    });

    await t.step("Option.None => defaultValue", () => {
      const defaultValue = 0;
      const func = (s: string) => s.length;
      const result = Option.map_or(Option.None<string>(), defaultValue, func);

      assertEquals(result, defaultValue);
    });
  });

  await t.step("map_or_else", async (t) => {
    await t.step("Option.Some(value) => mapFunc(value)", () => {
      const value = "Hello";
      const mapFunc = (s: string) => s.length;
      const defaultFunc = () => 0;
      const result = Option.map_or_else(
        Option.Some(value),
        defaultFunc,
        mapFunc,
      );

      assertEquals(result, mapFunc(value));
    });

    await t.step("Option.None => defaultFunc()", () => {
      const defaultFunc = () => 0;
      const mapFunc = (s: string) => s.length;
      const result = Option.map_or_else(
        Option.None<string>(),
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
        const result = Option.and(Option.Some(value), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, otherValue);
      },
    );

    await t.step(
      "Option.Some(value) & Option.None => Option.None",
      () => {
        const value = "Hello";
        const result = Option.and(Option.Some(value), Option.None());

        assertEquals(Option.isOption(result), true);
        assertEquals(Option.isNone(result), true);
      },
    );

    await t.step(
      "Option.None & Option.Some(otherValue) => Option.None",
      () => {
        const otherValue = "Hello";
        const result = Option.and(Option.None(), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);
        assertEquals(Option.isNone(result), true);
      },
    );

    await t.step(
      "Option.None & Option.None => Option.None",
      () => {
        const result = Option.and(Option.None(), Option.None());

        assertEquals(Option.isOption(result), true);
        assertEquals(Option.isNone(result), true);
      },
    );
  });

  await t.step("and_then", async (t) => {
    await t.step("Option.Some(value) => func(value) <Option.Some>", () => {
      const value = "Hello";
      const func = (s: string) => Option.Some(s.length);
      const result = Option.and_then(Option.Some(value), func);
      const expected = func(value);

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isOption(expected), true);

      const resultIsSome = Option.isSome(result);
      const expectedIsSome = Option.isSome(expected);

      assertEquals(resultIsSome, true);
      assertEquals(expectedIsSome, true);
      assertEquals(
        resultIsSome && result.value,
        expectedIsSome && expected.value,
      );
    });

    await t.step("Option.Some(value) => func(value) <Option.None>", () => {
      const value = "Hello";
      const func = (s: string) => Option.None<number>();
      const result = Option.and_then(Option.Some(value), func);
      const expected = func(value);

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isOption(expected), true);

      const resultIsNone = Option.isNone(result);
      const expectedIsNone = Option.isNone(expected);

      assertEquals(resultIsNone, true);
      assertEquals(expectedIsNone, true);
    });

    await t.step("Option.None => Option.None", () => {
      const func = (s: string) => Option.None<number>();
      const result = Option.and_then(Option.None<string>(), func);

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });
  });

  await t.step("or", async (t) => {
    await t.step(
      "Option.Some(value), Option.Some(otherValue) => Option.Some(value)",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.or(Option.Some(value), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, value);
      },
    );

    await t.step(
      "Option.Some(value), Option.None => Option.Some(value)",
      () => {
        const value = "Hello";
        const result = Option.or(Option.Some(value), Option.None());

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, value);
      },
    );

    await t.step(
      "Option.None, Option.Some(otherValue) => Option.Some(otherValue)",
      () => {
        const otherValue = "World";
        const result = Option.or(Option.None(), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, otherValue);
      },
    );

    await t.step("Option.None, Option.None => Option.None", () => {
      const result = Option.or(Option.None(), Option.None());

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });
  });

  await t.step("or_else", async (t) => {
    await t.step("Option.Some(value) => Option.Some(value)", () => {
      const value = "Hello";
      const otherValue = "World";
      const func = () => Option.Some(otherValue);
      const result = Option.or_else(Option.Some(value), func);

      assertEquals(Option.isOption(result), true);

      const isSome = Option.isSome(result);

      assertEquals(isSome, true);
      assertEquals(isSome && result.value, value);
    });

    await t.step("Option.None => func() <Option.Some>", () => {
      const otherValue = "World";
      const func = () => Option.Some(otherValue);
      const result = Option.or_else(Option.None<string>(), func);

      assertEquals(Option.isOption(result), true);

      const isSome = Option.isSome(result);

      assertEquals(isSome, true);
      assertEquals(isSome && result.value, otherValue);
    });

    await t.step("Option.None => func() <Option.None>", () => {
      const func = () => Option.None<string>();
      const result = Option.or_else(Option.None<string>(), func);

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });
  });

  await t.step("xor", async (t) => {
    await t.step(
      "Option.Some(value), Option.None => Option.Some(value)",
      () => {
        const value = "Hello";
        const result = Option.xor(Option.Some(value), Option.None());

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, value);
      },
    );

    await t.step(
      "Option.None, Option.Some(otherValue) => Option.Some(otherValue)",
      () => {
        const otherValue = "World";
        const result = Option.xor(Option.None(), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, otherValue);
      },
    );

    await t.step(
      "Option.Some(value), Option.Some(otherValue) => Option.None",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.xor(Option.Some(value), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);
        assertEquals(Option.isNone(result), true);
      },
    );

    await t.step("Option.None, Option.None => Option.None", () => {
      const result = Option.xor(Option.None(), Option.None());

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });
  });

  await t.step("zip", async (t) => {
    await t.step(
      "Option.Some(value), Option.Some(otherValue) => Option.Some([value, otherValue])",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.zip(Option.Some(value), Option.Some(otherValue));

        assertEquals(Option.isOption(result), true);

        const isSome = Option.isSome(result);

        assertEquals(isSome, true);
        assertEquals(isSome && result.value, [value, otherValue]);
      },
    );

    await t.step("Option.Some(value), Option.None => Option.None", () => {
      const value = "Hello";
      const result = Option.zip(Option.Some(value), Option.None());

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });

    await t.step("Option.None, Option.Some(otherValue) => Option.None", () => {
      const otherValue = "World";
      const result = Option.zip(Option.None(), Option.Some(otherValue));

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });

    await t.step("Option.None, Option.None => Option.None", () => {
      const result = Option.zip(Option.None(), Option.None());

      assertEquals(Option.isOption(result), true);
      assertEquals(Option.isNone(result), true);
    });
  });

  await t.step("unzip", async (t) => {
    await t.step(
      "Option.Some([value, otherValue]) => [Option.Some(value), Option.Some(otherValue)]",
      () => {
        const value = "Hello";
        const otherValue = "World";
        const result = Option.unzip(Option.Some([value, otherValue]));

        assertEquals(Array.isArray(result), true);
        assertEquals(result.length, 2);

        const first = result[0];

        assertEquals(Option.isOption(first), true);

        const firstIsSome = Option.isSome(first);

        assertEquals(firstIsSome, true);
        assertEquals(firstIsSome && first.value, value);

        const second = result[1];

        assertEquals(Option.isOption(second), true);

        const secondIsSome = Option.isSome(second);

        assertEquals(secondIsSome, true);
        assertEquals(secondIsSome && second.value, otherValue);
      },
    );

    await t.step(
      "Option.None => [Option.None, Option.None]",
      () => {
        const result = Option.unzip(Option.None<[string, string]>());

        assertEquals(Array.isArray(result), true);
        assertEquals(result.length, 2);

        const first = result[0];

        assertEquals(Option.isOption(first), true);
        assertEquals(Option.isNone(first), true);

        const second = result[1];

        assertEquals(Option.isOption(second), true);
        assertEquals(Option.isNone(second), true);
      },
    );
  });

  await t.step("IntoIterator trait", async (t) => {
    await t.step("intoIter", async (t) => {
      await t.step("Option.Some(value) => Iterator over [value]", () => {
        const option = Option.Some(5);
        const iter = option[IntoIteratorSymbol].intoIter();

        assertExists(iter[IteratorSymbol]);

        const firstItem = iter[IteratorSymbol].next();

        assertEquals(Option.isOption(firstItem), true);

        const firstItemIsSome = Option.isSome(firstItem);

        assertEquals(firstItemIsSome, true);
        assertEquals(firstItemIsSome && firstItem.value, 5);

        const secondItem = iter[IteratorSymbol].next();

        assertEquals(Option.isOption(secondItem), true);
        assertEquals(Option.isNone(secondItem), true);
      });

      await t.step("Option.None => Iterator over []", () => {
        const option = Option.None<number>();
        const iter = option[IntoIteratorSymbol].intoIter();

        assertExists(iter[IteratorSymbol]);

        const item = iter[IteratorSymbol].next();

        assertEquals(Option.isOption(item), true);
        assertEquals(Option.isNone(item), true);
      });
    });
  });
});
