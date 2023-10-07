import {
    assertInstanceOf,
    assertEquals,
    assertExists,
} from "../../../deps.ts";
import {Result} from "../../../types/result.ts";
import {IntoIteratorSymbol} from "../../../traits/into_iterator.ts";
import {IteratorSymbol} from "../../../traits/iterator.ts";
import {None, Some} from "../../../types/option.ts";

Deno.test("Result<T, E>.prototype[IntoIterator]().prototype.intoIter", async (t) => {
    await t.step("Ok(data) => Iterator over [data]", () => {
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
    await t.step("Err => Iterator over []", () => {
        const result = Result.Err("Error");
        const iter = result[IntoIteratorSymbol]().intoIter();

        assertExists(iter[IteratorSymbol]);
        assertInstanceOf(iter[IteratorSymbol]().next(), None);
    });
});