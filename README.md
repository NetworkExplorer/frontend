# frontend

The Frontend for NetworkExplorer built with React

## Table of Contents

- [frontend](#frontend)
	- [Table of Contents](#table-of-contents)
	- [Technical aspects](#technical-aspects)
	- [Structure](#structure)
		- [`src` folder](#src-folder)
			- [`components`](#components)
			- [`pages`](#pages)
			- [`global`](#global)
			- [`lib`](#lib)
			- [`models`](#models)
			- [`store`](#store)
		- [`public` folder](#public-folder)
		- [`config` folder](#config-folder)
		- [`scripts` folder](#scripts-folder)

## Technical aspects

- we use React with TypeScript
- for state management, we use React Redux and Redux Thunk (for async requests)
- for routing, we use react-router
- we use a Singleton for our Endpoints class
- we use SCSS modules for scoping css classes/IDs
- our state-management store is almost completely type-safe

## Structure

### [`src`](./src) folder

contains the components, pages, store files for the website

basically any folder that has a index.ts, comprises multiple sub-components etc. for easier imports, turning multiple import statements into one (ex: `@components` as an import "path")

when adding files, be sure to add them to their corresponding `index.ts` for easier imports

#### [`components`](./src/components)

the components used in the app; can be imported with `@components`, [`index.ts`](./src/components/index.ts)

#### [`pages`](./src/pages)

the different pages of the app; can be imported with `@pages`, [`index.ts`](./src/pages/index.ts)

#### [`global`](./src/global)

folder for global scss files (because we use CSS modules)

#### [`lib`](./src/lib)

contains interfaces and otheruseful helper function; can be imported with `@lib`, [`index.ts`](./src/lib/index.ts)

#### [`models`](./src/models)

contains the main models (interfaces) for the app; can be imported with `@models`, [`index.ts`](./src/models/index.ts)

#### [`store`](./src/store)

contains the store types, reducers and actions; the [`index.ts`](./src/store/index.ts) is used for creating necessary top-level types and condensing the reducers, actions etc.

every sub-folder is its own reducer with types and actions

### [`public`](./public) folder

the basic index.html and favicon

### [`config`](./config) folder

mostly webpack configuration from the ejected react-scripts, but also with slight modifications for usage of TypeScript paths (import classes etc. with things like `@models`)

### [`scripts`](./scripts) folder

scripts for running, building etc. from the ejected react-scripts
