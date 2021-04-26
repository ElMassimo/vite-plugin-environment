import { readFileSync } from 'fs'
import { join } from 'path'
import glob from 'fast-glob'
import { build, InlineConfig } from 'vite'

type Fixture = 'a' | 'b'

function compiledApp (name: Fixture) {
  const distPath = join(__dirname, 'fixtures', name, 'dist')
  const files = glob.sync('assets/app.*.js', { cwd: distPath })
  return readFileSync(join(distPath, files[0]), { encoding: 'utf8' })
}

async function buildFixture (name: Fixture, options?: InlineConfig) {
  const root = join(__dirname, 'fixtures', name)
  await build({ root, ...options })
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
