const core = require('@actions/core')
const github = require('@actions/github')

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path');
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

try {
  // `who-to-greet` input defined in action metadata file
  const secretId = core.getInput('secretId')
  const secretKey = core.getInput('secretKey')
  const envId = core.getInput('envId')

  const time = new Date().toTimeString()
  core.setOutput('time', time)
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}