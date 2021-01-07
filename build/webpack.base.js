// 存放 dev 和 prod 通用配置
const webpack = require("webpack");
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { rootUrl } = require("../utils/global");
const { customCopyPlugin,isImageCompression } = require(`${rootUrl}/.compile`);
//静态资源输出,将src目录下的assets文件夹复制到dist目录下
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    output: {
        path: path.resolve(__dirname, `${rootUrl}/dist`), // 输出的路径
        filename: "[name].bundle.js", // 打包后文件
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: isImageCompression?[
                    {
                        loader: "file-loader",
                        options: {
                            limit: 1024,
                            // 分离图片至images文件夹
                            esModule: false,
                            name: "./images/[name].[ext]?[hash]",
                            // publicPath:"./dist/assets/images"
                        },
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            //   bypassOnDebug: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            }, // the webp option will enable WEBP
                            webp: {
                                quality: 75,
                            },
                        },
                    },
                ]:[
                    {
                        loader: "file-loader",
                        options: {
                            limit: 1024,
                            // 分离图片至images文件夹
                            esModule: false,
                            name: "./images/[name].[ext]?[hash]",
                            // publicPath:"./dist/assets/images"
                        },
                    },
                ],
            },
            {
                test: /\.(mp3|mp4|mov|ogg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "./video/[name].[ext]?[hash]",
                        },
                    },
                ],
            },
            {
                test: /\.(xls[a-z]?|doc[a-z]?)$/,
                loader: "file-loader",
                options: {
                    name: "./files/[name].[ext]",
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "./fonts/[name].[hash:7].[ext]",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        new ProgressBarPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `${rootUrl}/static`),
                    to: path.resolve(__dirname, `${rootUrl}/dist`),
                },
                ...customCopyPlugin,
            ],
        }),
    ], // 插件
    resolve: {
        // 省略后缀
        extensions: [".tsx", ".ts", ".js", ".jsx", ".d.ts", ".css", ".scss", ".less"],
    },
};
