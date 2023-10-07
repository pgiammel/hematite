import { assertInstanceOf } from "../../../deps.ts";
import { Err, Result } from "../../../types/result.ts";

Deno.test("Result<T, E>.Err", async (t) => {
  await t.step(
    "Returns instance of Err",
    () => assertInstanceOf(Result.Err("Fail"), Err<unknown, string>),
  );
});
