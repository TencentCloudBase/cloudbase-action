# TencentCloudBase Hosting (云开发静态托管) Github Action

云开发静态托管可以支持将你的项目的静态网站和资源部署到 TencentCloudBase Hosting (云开发静态托管)

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
  who-to-greet: 'Mona the Octocat'