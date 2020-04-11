const core = require('@actions/core')

const util = require('util')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)


const main = async () => {
  process.env.HOME = '/tmp/'

  // `who-to-greet` input defined in action metadata file
  const secretId = core.getInput('secretId')
  const secretKey = core.getInput('secretKey')
  const envId = core.getInput('envId')
  const staticSrcPath = core.getInput('staticSrcPath')
  const staticDestPath = core.getInput('staticDestPath')

  await saveCredential(secretId, secretKey)

  console.log('login success')

  await deployHostingFile(staticSrcPath, staticDestPath, envId)

  console.log('deploy succss')

  const time = new Date().toTimeString()
  core.setOutput('time', time)
}

main().catch(error => core.setFailed(error.message))


// 部署静态文件
async function deployHostingFile(srcPath, cloudPath, envId) {
  const hosting = require('@cloudbase/cli/lib/commands/hosting/hosting')

  return hosting.deploy(
    {
      envId
    },
    srcPath,
    cloudPath
  )
}

// 存储身份信息
async function saveCredential(secretId, secretKey) {
  try {
    await mkdir('/tmp/.config')
    await mkdir('/tmp/.config/.cloudbase')
  } catch (e) { }

  await writeFile(
    '/tmp/.config/.cloudbase/auth.json',
    JSON.stringify({
      credential: {
        secretId,
        secretKey
      }
    })
  )
}
