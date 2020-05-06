const core = require("@actions/core");
const CloudBase = require("@cloudbase/manager-node");

const main = async ({
  secretId,
  secretKey,
  envId,
  staticSrcPath,
  staticDestPath,
  staticIgnore,
}) => {
  if (!secretId || !secretKey || !envId) {
    throw new Error("缺少必填参数");
  }

  const { hosting } = new CloudBase({
    secretId,
    secretKey,
    envId,
  });
  const results = [];
  let errors = [];
  // 同步静态文件
  await hosting.uploadFiles({
    localPath: staticSrcPath,
    cloudPath: staticDestPath,
    ignore: staticIgnore.split(","),
    onFileFinish: (err, data) => {
      if (err) {
        console.error(err);
        errors.push(err);
      } else {
        results.push(data);
        let i = data.Location.indexOf("/");
        console.log("✅ " + data.Location.slice(i));
      }
    },
  });

  if (error.length) {
    core.setFailed(new Error("部署文件部署失败，请重试"));
  } else {
    core.setOutput("deployResult", results);
    console.log("deploy succss");
  }
};

main({
  secretId: core.getInput("secretId"),
  secretKey: core.getInput("secretKey"),
  envId: core.getInput("envId"),
  staticSrcPath: core.getInput("staticSrcPath"),
  staticDestPath: core.getInput("staticDestPath"),
  staticIgnore: core.getInput("staticIgnore") || ".git,github,node_modules",
}).catch((error) => core.setFailed(error.message));
