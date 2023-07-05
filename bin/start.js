const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const path = require("path");
// const portfinder = require("portfinder");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let webpackConfig = require("../build/webpack.dev.js");
const {rootUrl} = require("../utils/global");
const {server: serverConfig, htmlChunk, favicon, devProxy = undefined} = require(`${rootUrl}/webpack-config.js`);
module.exports = args => {
    const {port} = args;
    // Object.values(webpackConfig.entry).map(item => {
    //     item.push(`webpack-dev-server/client?http://localhost:${port}/`);
    //     item.push(`webpack/hot/only-dev-server`);
    // });

    Object.keys(webpackConfig.entry).map(name => {
        let htmlConfig = {
            filename: name + ".html",
            template: path.resolve(__dirname, "../index.html"),
            title: name,
            headChunk: [],
            scriptChunk: []
        };

        if (htmlChunk) {
            let hc = htmlChunk["$all"] || {};
            htmlConfig = {
                ...htmlConfig,
                ...hc
            }
            if (htmlChunk[name]) {
                hc = htmlChunk[name];
                htmlConfig = {
                    ...htmlConfig,
                    ...hc,
                    headChunk: [...htmlConfig.headChunk, ...(hc.headChunk ?? [])].filter(Boolean),
                    scriptChunk: [...htmlConfig.scriptChunk, ...(hc.scriptChunk ?? [])].filter(Boolean),
                }
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
                scriptChunk: htmlConfig.scriptChunk.join("\n")
            })
        );
    });
    webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        ...serverConfig.alias
    };
    const compiler = webpack(webpackConfig);
    let server = new WebpackDevServer({
        ...webpackConfig.devServer,
        port: port,
        proxy: devProxy,
    }, compiler);
    (async () => {
        await server.startCallback();
    })()
};

// module.exports = new Promise((resolve, reject) => {
//     portfinder.getPort(
//         {
//             port: 8080, // 默认8080端口，若被占用，重复+1，直到找到可用端口或到stopPort才停止
//             stopPort: 65535 // maximum port
//         },
//         (err, port) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             devWebpackConfig.devServer.port = port;
//             resolve(devWebpackConfig);
//         }
//     );
// });
