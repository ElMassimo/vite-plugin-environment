import { loadEnv } from 'vite'
import type { Plugin } from 'vite'

/**
 * Provide a default string that will be used if the `process.env` value is not
 * defined.
 *
 * Use `undefined` for required variables which should cause the build to fail
 * if missing.
 *
 * Use `null` for optional variables.
 *
 * NOTE: Although you could technically pass a boolean or a number, all
 * process.env values are strings, and the inconsistency would make it easy to
 * introduce sutble bugs.
 */
type EnvVarDefault = string | null | undefined

type EnvVarDefaults = Record<string, EnvVarDefault>

type EnvVars = string[] | EnvVarDefaults

interface EnvOptions {
  /**
   * Whether to load environment variables defined in `.env` files.
   * @default true
   */
  loadEnvFiles?: boolean
}

function defineProcessEnvVars (env: EnvVarDefaults, keys: string[], defaultValues: EnvVarDefaults) {
  return keys.reduce((vars, key) => {
    const value = env[key] === undefined ? defaultValues[key] : env[key]
    if (value === undefined) throwMissingKeyError(key)
    vars[`process.env.${key}`] = JSON.stringify(value)
    return vars
  }, {} as Record<string, string | null>)
}

function throwMissingKeyError (key: string) {
  throw new Error(`vite-plugin-environment: the \`${key}\` environment variable is undefined.\n\n` +
    "You can pass an object with default values to suppress this warning.\n" +
    "See https://github.com/ElMassimo/vite-plugin-environment for guidance."
  )
}

/**
 * Expose `process.env` environment variables to your client code.
 *
 * @param  {EnvVars} vars A list of variables you wish to expose, or an object
 *                        that maps variable names to defaut values to use when
 *                        a variable is not defined.
 */
export default function EnvironmentPlugin (vars: EnvVars, { loadEnvFiles = true }: EnvOptions = {}): Plugin {
  return {
    name: 'process-env-variables',
    enforce: 'post',
    config ({ root = process.cwd() }, { mode }) {
      const env = loadEnvFiles ? loadEnv(mode, root, '') : process.env
      const keys = Array.isArray(vars) ? vars : Object.keys(vars)
      const defaultValues = Array.isArray(vars) ? {} : vars
      return { define: defineProcessEnvVars(env, keys, defaultValues) }
    },
  }
}
