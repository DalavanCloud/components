import { all, compact, forEach, isFunction, isObject, isArray, keys } from '@serverless/utils'
import fs from 'fs-extra'
import { basename, isAbsolute, join, resolve } from 'path'
import { version } from '../../../package.json'

const Create = {
  async run(context) {
    context.log('Creating component...')

    console.log('context.options:', context.options)
    const { options } = context
    if (options._[1] !== 'component') {
      throw new Error(`Cannot create a project of unknown type ${options._[1]}`)
    }

    let { path } = options
    if (!path) {
      path = process.cwd()
    }
    if (!isAbsolute(path)) {
      path = resolve(process.cwd(), path)
    }

    const name = basename(path)
    console.log('path:', path)
    console.log('name:', name)

    // const packageJsonTemplate = {
    //   name: `@serverless-components/${name}`,
    //   version: version,
    //   private: true,
    //   main: 'dist/index.js',
    //   scripts: {
    //     test: 'echo "Error: no test specified" && exit 1'
    //   }
    // }
    //
    // const serverlessYmlTemplate = `---
    //   type: ${name}
    //   version: ${version}
    //   core: ${version
    //     .split('.')
    //     .slice(0, 2)
    //     .join('.')}.x
    //
    //   description: "My component description"
    //   license: Apache-2.0
    //   author: "Serverless, Inc. <hello@serverless.com> (https://serverless.com)"
    //   repository: "github:serverless/components"
    //
    //   inputTypes:
    //     myInput:
    //       type: string
    //       displayName: My input
    //       description: My input string
    //       example: hello-world
    //
    //   outputTypes:
    //     myOutput:
    //       type: string
    //       description: my output string
    //   `
    //
    // const readMeTemplate = `<!-- AUTO-GENERATED-CONTENT:START (COMPONENT_HEADER) -->
    //   <!-- AUTO-GENERATED-CONTENT:END -->
    //   <!-- AUTO-GENERATED-CONTENT:START (TOC) -->
    //   <!-- AUTO-GENERATED-CONTENT:END -->
    //   <!-- AUTO-GENERATED-CONTENT:START (COMPONENT_INPUT_TYPES) -->
    //   <!-- AUTO-GENERATED-CONTENT:END -->
    //   <!-- AUTO-GENERATED-CONTENT:START (COMPONENT_OUTPUT_TYPES) -->
    //   <!-- AUTO-GENERATED-CONTENT:END -->
    //   <!-- AUTO-GENERATED-CONTENT:START (COMPONENT_EXAMPLES) -->
    //   <!-- AUTO-GENERATED-CONTENT:END -->
    //   `
    //
    // const indexTemplate = `// ${name}
    //   const deploy = async (inputs, context) => {
    //     return {}
    //   }
    //
    //   const remove = async (inputs, context) => {
    //     return {}
    //   }
    //
    //   module.exports = {
    //     deploy,
    //     remove
    //   }
    //   `
    //
    // const indexTestTemplate = `// ${name}
    //   import myComponent from './index'
    //
    //   describe('${name} Unit Tests', () => {
    //     it('should have tests', async () => {
    //       const contextMock = {
    //         state: {},
    //         log: () => {},
    //         saveState: jest.fn()
    //       }
    //       await myComponent.deploy({}, contextMock)
    //       expect(false).toBe(true)
    //     })
    //   })
    //   `
    //
    //
    // if (await fs.exists(directory)) {
    //   throw new Error(`Component "${name}" already exists.`)
    // }
    // await fs.ensureDir(directory)
    // await fs.ensureDir(path.join(directory, 'src'))
    // await all([
    //   fs.writeJson(path.join(directory, 'package.json'), packageJsonTemplate, {
    //     encoding: 'utf8',
    //     spaces: 2
    //   }),
    //   fs.writeFile(path.join(directory, 'serverless.yml'), serverlessYmlTemplate, {
    //     encoding: 'utf8'
    //   }),
    //   fs.writeFile(path.join(directory, 'README.md'), readMeTemplate, {
    //     encoding: 'utf8'
    //   }),
    //   fs.writeFile(path.join(directory, 'src', 'index.js'), indexTemplate, {
    //     encoding: 'utf8'
    //   }),
    //   fs.writeFile(path.join(directory, 'src', 'index.test.js'), indexTestTemplate, {
    //     encoding: 'utf8'
    //   })
    // ])
  }
}

export default Create
