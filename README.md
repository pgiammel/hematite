# Hematite

## Table of contents

- [What is this?](#what-is-this)
- [Why was it made?](#why-was-this-made)
- [Where is the important stuff?](#where-is-the-important-stuff)
- [How to use it?](#how-to-use-it)
- [Who can contribute?](#who-can-contribute)
- [Which license is used?](#which-license-is-used)

## What is this?

This is an experimental **Deno** library to write code than more or less feel
just a little bit kind of Rust-ish, while being as typed as possible.

There are a few tests and documentation comments here and there, as well as some
documented undefined behaviour.

For now (and who knows for how long), everything only handles well-formed
inputs.

## Why was this made?

For no real reason besides testing some Typescript type shenanigans. I highly
discourage you from using this library in any production work.

## Where is the important stuff?

```
hematite
|- traits
   |- into_iterator.ts --- IntoIterator trait wannabe
   |- iterator.ts -------- Iterator trait lookalike
|- types
   |- const_iterator.ts -- Iterator over pre-defined items
   |- map.ts ------------- Map struct copycat
   |- option.ts ---------- Option enum impersonator
   |- result.ts ---------- Result enum aspirant
   |- mod.ts ------------- Types entrypoint, you can import from here
|- utils
   |- function.ts -------- Function utilities
   |- tuple.ts ----------- Tuple type utilities 
```

## How to use it?

It's quite simple, really...

### Option\<T>

```typescript
function nullableToOption<T>(value: T | null): Option<NonNullable<T>> {
    if (value === null) {
        return Option.None();
    }

    return Option.Some(value);
}

// Option<number>
const maybeNumber = nullableToOption(5);

if (Option.isSome(maybeNumber)) {
    console.log(maybeNumber.value * 2);
}
```

```typescript
console.log(Option.map(Option.Some(5), n => n * 2));
```

## Who can contribute?

Anyone who cares.

If you are actively using the library (which I wouldn't
recommend) and there are some things you want to see added, fixed or whatever,
feel free to open an issue. I can't guarantee that it'll be taken care of
though.

If you are fixing or adding stuff and such on this library, and you want to
share your amazing work with the users of this repo, consider opening a pull
request.

## Which license is used?

MIT License - Copyright (c) 2023 Pascal GIAMMELLUCA
