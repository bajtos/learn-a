# Lerna + Project References

This is a "bare minimum" repo that shows one way to configure TypeScript Project References with lerna. There are a lot of different ways you can set things up and this isn't intended to be authoratitive guidance or exclusionary of other ways that might work better in your project.

# Setting up this repo

```sh
git clone https://github.com/raymondfeng/learn-a.git
cd learn-a
npm install
npm test
```

### General Structure

As with a normal lerna repo, there's a `packages` folder. Inside we have three creatively named packages `pkg1`, `pkg2`, and `pkg3`.

```
tsconfig.settings.json
tsconfig.json
packages/
| pkg1/
  | src/
  | | (typescript files)
  | tsconfig.json
  | dist/
  | | (javascript files)
  | | (.d.ts files)
| pkg2/
  | (same as pkg1)
| pkg3/
  | (same as pkg1)
```

Let's review each file in the repo and explain what's going on

#### `tsconfig.settings.json`
```js
{
    "compilerOptions": {
        // Always include these settings
        "composite": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,

        // These settings are totally up to you
        "esModuleInterop": true,
        "target": "es5",
        "module": "commonjs",
        "strict": true
    }
}
```
This file contains the "default" settings that all packages will use for compilation. You will definitely want the `composite`, `declaration`, `declarationMap`, and `sourceMap` settings enabled for all projects, so include those in this file. Other settings, like `target` and `strict`, can be specified here if you'd like to enable them by default. You'll also be able to override these settings on a per-package basis if needed.

#### `tsconfig.json`
```json
{
    "files": [],
    "references": [
        { "path": "packages/pkg1/tsconfig.json" },
        { "path": "packages/pkg2/tsconfig.json" },
        { "path": "packages/pkg3/tsconfig.json" }
    ]
}
```
This file is pretty simple - simply list the packages that need to be built with `tsc` in the `references` array.
You should also include `"files": []` in this file - this will prevent an incorrect invocation of `tsc` without `-b` from trying to build the entire packages folder source files as one compilation (which will fail, but drop a bunch of .js files in random places as an annoying side effect).

#### `packages/pkg2/tsconfig.json`

We'll just cover one of the `pkg1` / `pkg2` / `pkg3` packages since they're basically identical for the purposes of this demo. Here's `pkg2`'s `src/tsconfig.json`:
```json
{
  "extends": "../../../tsconfig.settings.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "src",
    "outDir": "dist",
  },
  "references": [
    { "path": "../../pkg1/tsconfig.json" }
  ]
}
```
The `extends` property pulls in the settings we wrote in `tsconfig.settings.json`, so we don't have to duplicate any settings described there.

In `compilerOptions`, we've set `outDir` to `dist` and `rootDir` to `src`, then placed all my `.ts` files in `src`. This means `src/index.ts` will build to `dist/index.js` and `dist/index.d.ts`. This is also the place where you could override settings like `strict` or `target` if you needed to change them on a per-project basis.

In the `references` array, we list the paths to the other projects' `tsconfig.json` files (or containing folders, as shown here). This will both ensure that we locate the `.d.ts` files correctly, and set up a proper build ordering.

#### `packages/pkg2/src/index.ts`
```ts
import * as p1 from '@ryancavanaugh/pkg1';

export function fn4() {
    p1.fn();
}
```
Nothing unusual going on here. We import and export with the usual syntax. Notably, if you open this repo in an editor, you can still "Go to Definition (F12)" on `p1.fn` here and land in `pkg1/foo.ts` - the original sourcecode - even though "under the covers" it's using the much faster `.d.ts` file for typechecking.

#### `packages/pkg2/package.json`
Here are the relevant excerpts from the `package.json`:
```json
{
  "main": "dist/src/index.js",
  "typings": "dist/src/index.d.ts",
  "scripts": {
    "prepublishOnly": "tsc -b ."
  },
  "devDependencies": {
    "typescript": "^3.1.1"
  }
}
```

Because we build to `dist`, we need to set `main` to the `.js` file there *and* `typings` to the `.d.ts` file.

In `scripts`, we use the local copy of `tsc` (listed here as a dev dependency) to run a *build mode* compilation on the project. This will ensure that the `dist` folder is always built before `npm publish`, and blocks any publishes that try to push non-compiling code.

#### `packages/pkg2/.npmignore` / `packages/pkg2/.gitignore`

*.gitignore*
```
dist/
```

*.npmignore*
```
# Empty, but needs to exist
```

The `.gitignore` stops us from checking in build outputs, which is generally a good idea. By default, `npm` won't publish files that are ignored by `git`, so we need a separate `.npmignore` file so that the `dist` folder still gets published!

# Workflow

All your lerna commands and workflow will work as expected here.

To build the TypeScript projects, you can run individual builds with `tsc -b`:
```
npx tsc -b packages/pkg3
```
Or just build everything:
```
npx tsc -b packages
```
