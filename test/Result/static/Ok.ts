import { assertInstanceOf } from "../../../deps.ts";
import { Ok, Result } from "../../../types/result.ts";

Deno.test("Result<T, E>.Ok", async (t) => {
  await t.step(
    "Returns instance of Ok",
    () => assertInstanceOf(Result.Ok("Hello"), Ok<string, unknown>),
  );
});
