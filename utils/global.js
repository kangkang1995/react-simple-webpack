const path = require('path');
const fs = require('fs');


// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    // rootUrl: "..", //定义 项目的路径
    // rootUrl: "../../../..",
    rootUrl: resolveApp("."),
    // 是否是开发模式
    isDev: process.argv[2] === "start",
};
