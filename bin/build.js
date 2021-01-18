const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfig = require("../build/webpack.prod.js");

const {rootUrl} = require("../utils/global");
const { build: buildConfig, htmlChunk, favicon,isBundleAnalyzerPlugin } = require(`${rootUrl}/webpack-config.js`);

module.exports = (args) => {
    let config = buildConfig[args.type];
    if (config) {
        webpackConfig.resolve.alias = config.alias || {};
    }
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
                //var HtmlWebpackPlugin = require('html-webpack-plugin');
                title: htmlConfig.title, //配合html-webpack-plugin的配置,
                chunks: [name],
                favicon,
                headChunk: htmlConfig.headChunk.join("\n"),
                scriptChunk: htmlConfig.scriptChunk.join("\n"),
            })
        );

    });
    webpack(webpackConfig, function (err, stats) {
        process.stdout.write(
            stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
            }) + "\n"
        );
    });
};
