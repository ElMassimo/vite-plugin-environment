import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.[jt]s?(x)'],
  testTimeout: process.env.CI ? 30000 : 10000,
  watchPathIgnorePatterns: ['<rootDir>/temp'],
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json',
    },
  },
}

export default config
