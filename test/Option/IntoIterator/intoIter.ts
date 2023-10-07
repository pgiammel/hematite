import {Option} from "../../../types/option.ts";
import {assertEquals} from "../../../deps.ts";
import {IntoIteratorSymbol} from "../../../traits/into_iterator.ts";
import {assertExists, assertInstanceOf} from "../../../deps.ts";
import {IteratorSymbol} from "../../../traits/iterator.ts";
import {None, Some} from "../../../types/option.ts";

Deno.test("Option<T>.prototype[IntoIterator]().prototype.intoIter", async (t) => {
    await t.step("Some(value) => Iterator over [value]", () => {
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

    await t.step("None => Iterator over []", () => {
        const option = Option.None<number>();
        const iter = option[IntoIteratorSymbol]().intoIter();

        assertExists(iter[IteratorSymbol]);

        const item = iter[IteratorSymbol]().next();

        assertInstanceOf(item, None<number>);
    });
});