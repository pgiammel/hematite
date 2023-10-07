import { assertEquals } from "../../deps.ts";
import { Option } from "../../types/option.ts";

Deno.test("Option<T>.prototype.isSome", async (t) => {
  await t.step(
    "Some(_) => true",
    () => assertEquals(Option.Some("Hello").isSome(), true),
  );

  await t.step(
    "None => false",
    () => assertEquals(Option.None().isSome(), false),
  );
});
