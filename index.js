const core = require('@actions/core')
const github = require('@actions/github')

const Client = require('@cloudbase/cli');


const main = async () => {
  // `who-to-greet` input defined in action metadata file
  const secretId = core.getInput('secretId')
  const secretKey = core.getInput('secretKey')
  const envId = core.getInput('envId')
  const staticSrcPath = core.getInput('staticSrcPath')
  const staticDestPath = core.getInput('staticDestPath')

  const client = new Client(secretId, secretKey);

  console.log('login success')

  await deployHostingFile(staticSrcPath, staticDestPath, envId)

  console.log('deploy succss')

  const time = new Date().toTimeString()
  core.setOutput('time', time)
}

main().catch(error => core.setFailed(error.message))


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