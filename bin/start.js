const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let webpackConfig = require("../build/webpack.dev.js");
const {rootUrl} = require("../utils/global");
const { server: serverConfig, htmlChunk, favicon } = require(`${rootUrl}/webpack-config.js`);
module.exports = (args) => {
    const { port } = args;
    Object.values(webpackConfig.entry).map((item) => {
        item.push(`webpack-dev-server/client?http://localhost:${port}/`);
        item.push(`webpack/hot/only-dev-server`);
        // item.push(`react-hot-loader/patch`);
    });

    Object.keys(webpackConfig.entry).map((name) => {
        let htmlConfig = {
            filename: name + ".html",
            template: path.resolve(__dirname, "../index.html"),
            title: name,
            headChunk: [],
            scriptChunk: [],
        };

        if (htmlChunk) {
            let hc = htmlChunk["$all"] || {};
            if (hc.filename) htmlConfig.filename = hc.filename;
            if (hc.template) htmlConfig.template = hc.template;
            if (hc.title) htmlConfig.title = hc.title;
            if (hc.headChunk) htmlConfig.headChunk = hc.headChunk;
            if (hc.scriptChunk) htmlConfig.scriptChunk = hc.scriptChunk;
            if (htmlChunk[name]) {
                hc = htmlChunk[name];
                if (hc.filename) htmlConfig.filename = hc.filename;
                if (hc.template) htmlConfig.template = hc.template;
                if (hc.title) htmlConfig.title = hc.title;
                if (hc.headChunk) htmlConfig.headChunk = [...htmlConfig.headChunk, ...hc.headChunk];
                if (hc.scriptChunk) htmlConfig.scriptChunk = [...htmlConfig.scriptChunk, ...hc.scriptChunk];
            }
        }
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                filename: htmlConfig.filename,
                template: htmlConfig.template,
                title: htmlConfig.title, //配合html-webpack-plugin的配置,
                chunks: [name],
                favicon,
                headChunk: htmlConfig.headChunk.join("\n"),
                scriptChunk: htmlConfig.scriptChunk.join("\n"),
            })
        );
    });
    let alias = serverConfig.alias;
    if (alias) webpackConfig.resolve.alias = alias;
    let server = new WebpackDevServer(webpack(webpackConfig), {
        hot: true,
        inline: true,
        compress: true, //一切服务都启用gzip 压缩：
        open: true, // 自动打开浏览器
        stats: 'errors-only',
        // proxy:{} //代理，解决跨域
    });
    // console.log(webpackConfig,'webpackConfig.entry')
    server.listen(port, "0.0.0.0");
};
