import { assertInstanceOf } from "../../../deps.ts";
import { Option, Some } from "../../../types/option.ts";

Deno.test("Option<T>.Some", async (t) => {
  await t.step(
    "Returns instance of Some",
    () => assertInstanceOf(Option.Some("Hello"), Some<string>),
  );
});
