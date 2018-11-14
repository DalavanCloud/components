import cp from 'child_process'
import os from 'os'
import path from 'path'

const rootPath = path.join(__dirname, '..')
const registryPath = path.join(rootPath, 'registry')
const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

const build = async () =>
  new Promise((resolve, reject) => {
    const command = cp.spawn(npmCmd, ['run', 'build'], {
      env: process.env,
      cwd: rootPath
    })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const installRegistryDependencies = async () =>
  new Promise((resolve, reject) => {
    const command = cp.spawn(npmCmd, ['install'], {
      env: process.env,
      cwd: registryPath
    })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stdout.on('close', () => resolve())
    command.stdout.on('end', () => resolve())
    command.stdout.on('error', (error) => reject(error))
  })

const exec = async () => {
  await build()
  await installRegistryDependencies()
}

exec()
