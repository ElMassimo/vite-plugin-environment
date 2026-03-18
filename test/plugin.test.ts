import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { build } from 'vite'
import type { InlineConfig } from 'vite'
import { describe, test, expect } from 'vite-plus/test'

type Fixture = 'a' | 'b' | 'c'

function compiledApp (name: Fixture) {
  const distPath = join(__dirname, 'fixtures', name, 'dist', 'assets')
  const file = readdirSync(distPath).find(f => f.startsWith('app-') && f.endsWith('.js'))
  return readFileSync(join(distPath, file!), { encoding: 'utf8' })
}

async function buildFixture (name: Fixture, options?: InlineConfig) {
  const root = join(__dirname, 'fixtures', name)
  await build({ root, logLevel: 'warn', ...options })
}

describe('keys', () => {
  test('throws an error if an environment variable is missing', async () => {
    try {
      await buildFixture('a', { mode: 'staging' })
    }
    catch (error) {
      expect(error.message).toMatch(/`API_KEY` environment variable is undefined/)
    }
  })

  test('replaces the variables', async () => {
    await buildFixture('a', { mode: 'production' })
    expect(compiledApp('a')).toContain('console.log(`v2`)')
  })
})

describe('default values', () => {
  test('throws an error if an environment variable is missing', async () => {
    try {
      await buildFixture('b', { mode: 'staging' })
    }
    catch (error) {
      expect(error.message).toMatch(/`API_KEY` environment variable is undefined/)
    }
  })

  test('replaces the variables', async () => {
    await buildFixture('b', { mode: 'production' })
    expect(compiledApp('b')).toContain('console.log(`v2`)')
  })

  test('uses defaults only when not available', async () => {
    await buildFixture('b', { mode: 'development' })
    expect(compiledApp('b')).toContain('console.log(`v3`)')
  })
})

describe('advanced options', () => {
  test('throws an error if an environment variable is missing', async () => {
    try {
      await buildFixture('c', { mode: 'staging' })
    }
    catch (error) {
      expect(error.message).toMatch(/`API_KEY` environment variable is undefined/)
    }
  })

  test('replaces the variables without failing', async () => {
    await buildFixture('c', { mode: 'production' })
    const output = compiledApp('c')
    expect(output).toContain('console.log(void 0)')
    expect(output).toContain('window.apiKey=`d2fab04aacaad208`')
  })

  test('uses defaults only when not available', async () => {
    await buildFixture('c', { mode: 'development' })
    expect(compiledApp('c')).toContain('console.log(`v3`)')
    expect(compiledApp('c')).toContain('window.apiKey=`d2fab04aacaad208`')
  })

  test('uses envDir when specified', async () => {
    await buildFixture('c', { mode: 'development', envDir: 'alt' })
    expect(compiledApp('c')).toContain('console.log(`v4`)')
    expect(compiledApp('c')).toContain('window.apiKey=`c2fab04aacaad2089`')
  })
})
