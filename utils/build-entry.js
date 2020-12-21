const path = require("path");
const glob = require("glob");
const { customEntry } = require("../.compile");
const {rootUrl} = require("../utils/global");
function getEntries(globPath) {
    const files = glob.sync(globPath),
        entries = {};
    files.forEach(function (filepath) {
        const split = filepath.split("/");
        const name = split[split.length - 2];
        entries[name] = [filepath];
    });
    return entries;
}

// 增加自定义入口文件
const newEntry = customEntry ? customEntry : path.resolve(__dirname, `${rootUrl}/src/modules/*/index.tsx`);
module.exports = getEntries(newEntry);
