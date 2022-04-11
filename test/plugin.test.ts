import { readFileSync } from 'fs'
import { join } from 'path'
import glob from 'fast-glob'
import { build, InlineConfig } from 'vite'
import { describe, test, expect } from 'vitest'

type Fixture = 'a' | 'b' | 'c'

function compiledApp (name: Fixture) {
  const distPath = join(__dirname, 'fixtures', name, 'dist')
  const files = glob.sync('assets/app.*.js', { cwd: distPath })
  return readFileSync(join(distPath, files[0]), { encoding: 'utf8' })
}

async function buildFixture (name: Fixture, options?: InlineConfig) {
  const root = join(__dirname, 'fixtures', name)
  await build({ root, logLevel: 'warn', ...options })
}

describe('keys', () => {
  test('throws an error if an environment variable is missing', async (done) => {
    expect.assertions(1)
    try {
      await buildFixture('a', { mode: 'staging' })
    }
    catch (error) {
      expect(error.message).toMatch(/`API_KEY` environment variable is undefined/)
    }
    done()
  })

  test('replaces the variables', async (done) => {
    expect.assertions(1)
    await buildFixture('a', { mode: 'production' })
    expect(compiledApp('a')).toContain('console.log("v2")')
    done()
  })
})

describe('default values', () => {
  test('throws an error if an environment variable is missing', async (done) => {
    expect.assertions(1)
    try {
      await buildFixture('b', { mode: 'staging' })
    }
    catch (error) {
      expect(error.message).toMatch(/`API_KEY` environment variable is undefined/)
    }
    done()
  })

  test('replaces the variables', async (done) => {
    expect.assertions(1)
    await buildFixture('b', { mode: 'production' })
    expect(compiledApp('b')).toContain('console.log("v2")')
    done()
  })

  test('uses defaults only when not available', async (done) => {
    expect.assertions(1)
    await buildFixture('b', { mode: 'development' })
    expect(compiledApp('b')).toContain('console.log("v3")')
    done()
  })
})

describe('advanced options', () => {
  test('throws an error if an environment variable is missing', async (done) => {
    expect.assertions(1)
    try {
      await buildFixture('c', { mode: 'staging' })
    }
    catch (error) {
      expect(error.message).toMatch(/`API_KEY` environment variable is undefined/)
    }
    done()
  })

  test('replaces the variables without failing', async (done) => {
    expect.assertions(2)
    await buildFixture('c', { mode: 'production' })
    expect(compiledApp('c')).toContain('console.log({}.VUE_APP_VERSION)')
    expect(compiledApp('c')).toContain('window.apiKey="d2fab04aacaad208"')
    done()
  })

  test('uses defaults only when not available', async (done) => {
    expect.assertions(2)
    await buildFixture('c', { mode: 'development' })
    expect(compiledApp('c')).toContain('console.log("v3")')
    expect(compiledApp('c')).toContain('window.apiKey="d2fab04aacaad208"')
    done()
  })

  test('uses envDir when specified', async (done) => {
    expect.assertions(2)
    await buildFixture('c', { mode: 'development', envDir: 'alt' })
    expect(compiledApp('c')).toContain('console.log("v4")')
    expect(compiledApp('c')).toContain('window.apiKey="c2fab04aacaad2089"')
    done()
  })
})
