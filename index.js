const core = require('@actions/core')
const Client = require('@cloudbase/cli');


const main = async () => {
  const secretId = core.getInput('secretId')
  const secretKey = core.getInput('secretKey')
  const envId = core.getInput('envId')
  const staticSrcPath = core.getInput('staticSrcPath')
  const staticDestPath = core.getInput('staticDestPath')

  new Client(secretId, secretKey);
  console.log('login success')

  const result = await deployHostingFile(staticSrcPath, staticDestPath, envId)
  console.log('deploy succss')

  core.setOutput('deployResult', result)
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