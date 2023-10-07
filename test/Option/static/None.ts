import { assertInstanceOf } from "../../../deps.ts";
import { None, Option } from "../../../types/option.ts";

Deno.test("Option<T>.None", async (t) => {
  await t.step(
    "Returns an instance of None",
    () => assertInstanceOf(Option.None(), None),
  );
});
