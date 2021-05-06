<h2 align='center'><samp>vite-plugin-environment</samp></h2>

<p align='center'>Expose environment variables to your client code in <samp>Vite.js</samp></p>

<p align='center'>
  <a href='https://www.npmjs.com/package/vite-plugin-environment'>
    <img src='https://img.shields.io/npm/v/vite-plugin-environment?color=222&style=flat-square'>
  </a>
  <a href='https://github.com/ElMassimo/vite-plugin-environment/blob/main/LICENSE.txt'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg'>
  </a>
</p>

<br>

[plugin]: https://github.com/ElMassimo/vite-plugin-environment
[migration]: https://vite-ruby.netlify.app/guide/migration.html#migrating-to-vite
[vite.js]: http://vitejs.dev/
[EnvironmentPlugin]: https://webpack.js.org/plugins/environment-plugin/
[define]: https://vitejs.dev/config/#define
[Vite Ruby]: https://vite-ruby.netlify.app/config/#source-maps-%F0%9F%97%BA
[meta env]: https://vitejs.dev/guide/env-and-mode.html#env-files
[vite-plugin-env-compatible]: https://github.com/IndexXuan/vite-plugin-env-compatible

## Why? 🤔

Although [Vite.js] provides its [own mechanism][meta env] for exposing environment variables through [`import.meta.env`][meta env], sometimes it's not possible or desirable to prefix variables with `VITE_`.

This plugin is a shorthand for exposing environment variables by configuring <kbd>[define]</kbd>.

It provides the same functionality as webpack's <kbd>[EnvironmentPlugin]</kbd>, but for Vite.js.

## Installation 💿

Install the package as a development dependency:

```bash
npm i -D vite-plugin-environment # yarn add -D vite-plugin-environment
```

## Usage 🚀

You can provide a list of environment variable names to expose to your client code:

```js
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig({
  plugins: [
    EnvironmentPlugin(['API_KEY', 'DEBUG']),
  ],
})
```

And then use them as:

```js
const apiKey = process.env.API_KEY
```

### Usage with default values

You may instead provide an object which maps keys to their default values.

The default value for a key is only used if the variable is not defined.

```js
EnvironmentPlugin({
  // Uses 'development' if the NODE_ENV environment variable is not defined.
  NODE_ENV: 'development',

  // Have in mind that variables coming from process.env are always strings.
  DEBUG: 'false',

  // Required: will fail if the API_KEY environment variable is not provided.
  API_KEY: undefined, 
 
  // Optional: will not fail if the APP_VERSION environment variable is missing.
  APP_VERSION: null,
}),
```

Use `null` for optional variables, or `undefined` for variables that __must__ be provided.

## Configuration ⚙️

Have in mind that you can add the plugin several times—passing different options to load different sets of variables.

### Loading prefixed variables

In some cases, it's useful to load all environment variables with a certain prefix.

You can achieve that by passing `'all'` and providing the <kbd>prefix</kbd> option.

```js
EnvironmentPlugin('all', { prefix: 'VUE_APP_' }),
EnvironmentPlugin('all', { prefix: 'REACT_APP_' }),
```

and then use it as usual:

```js
process.env.VUE_APP_NOT_SECRET_CODE
```

### Exposing variables differently

When porting apps to Vite or using SSR it can be useful to expose variables in `process.env`, which is the default.

In other cases, you may use the <kbd>defineOn</kbd> option to expose them in a different object, such as `import.meta.env`.

```js
EnvironmentPlugin({ APP_VERSION: 'local' }, { defineOn: 'import.meta.env' }),
```

and then use it as:

```js
const version = import.meta.env.APP_VERSION
```

### Ignoring `.env` files

By default the plugin will load `.env` files using the same [strategy][meta env] as Vite.js.

If you want to ignore `.env` files and only use values in `process.env`, you can opt out:

```js
EnvironmentPlugin(['API_KEY'], { loadEnvFiles: false }),
```

## Inside the box 📦

The first example in this README is equivalent to [manually configuring][define]:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
  }
})
```

except it will also use any variables provided by your `.env` files, and will
__fail__ if any of the specified variables is _not defined_.

## Acknowledgements

I created this library only because I wanted something that:

- Reused Vite's `loadEnv` functionality, making the library _very_ light (no dependencies).
- Allowed to provide a subset of variables to expose, and their defaults.

The following libraries might be helpful depending on your use case:

- [vite-plugin-env-compatible]: Convenient if you are porting a Vue CLI or create-react-app. 

## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
