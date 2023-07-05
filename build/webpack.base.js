// 存放 dev 和 prod 通用配置
const webpack = require("webpack");
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 分离CSS插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {rootUrl, isDev} = require("../utils/global");
const {customCopyPlugin, isImageCompression} = require(`${rootUrl}/webpack-config.js`);
//静态资源输出,将src目录下的assets文件夹复制到dist目录下
const CopyPlugin = require("copy-webpack-plugin");

const babelPlugins = [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    ["@babel/plugin-proposal-decorators", {legacy: true}],
    "@babel/plugin-transform-react-jsx",
    ["@babel/plugin-proposal-class-properties"],
    "@babel/plugin-transform-runtime",
    ['@babel/plugin-transform-modules-commonjs'],
    ["@babel/plugin-transform-typescript", {allowNamespaces: true}],
    ["@babel/plugin-syntax-dynamic-import"]
];
const postcssLoader = {loader: "postcss-loader", options: {postcssOptions: {plugins: ["autoprefixer"]}}};
const stylesHandler = isDev
    ? "style-loader"
    : {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: "../"
        }
    };
module.exports = {
    output: {
        path: path.resolve(__dirname, `${rootUrl}/dist`), // 输出的路径
        filename: "[name].bundle.js", // 打包后文件
        clean: true //每次构建清除dist包
        // publicPath:"/"
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                loader: require.resolve("source-map-loader"),
            },
            {
                test: /\.(js|mjs|jsx|tsx|ts)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        // 不转换模块类型，仍然使用 ES Module，方便构建工具 tree shaking
                                        // modules: false,
                                        targets: {
                                            browsers: ["> 1%", "last 2 versions", "ie >= 8"]
                                        },
                                        useBuiltIns: "usage",
                                        corejs: { version: "3.30.2", proposals: true }
                                    }
                                ],
                                [
                                    "@babel/preset-react",
                                    {
                                        runtime: "automatic"
                                    }
                                ],
                                "@babel/preset-typescript"
                            ],
                            compact: true,
                            // 这个不设置的话，webpack 魔法注释会被删除，魔法注释用于分包
                            comments: true,
                            plugins: [...babelPlugins, isDev && require.resolve("react-refresh/babel")].filter(Boolean)
                        }
                    }
                ],
                exclude: /node_modules[\\/](?!(@luban|@iworks|@lubango)[\\/])/
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [stylesHandler, "css-loader", postcssLoader, "sass-loader"]
            },
            {
                test: /\.less$/,
                use: [
                    stylesHandler,
                    "css-loader",
                    postcssLoader,
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/,
                type: "asset",
                parser: {
                    // Conditions for converting to base64
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 10kb
                    }
                },
                generator: {
                    filename: "images/[name].[ext]?[hash]"
                }
            },
            {
                test: /\.(mp3|mp4|mov|ogg)$/,
                type: "asset",
                generator: {
                    filename: "./video/[name].[ext]?[hash]"
                }
            },
            {
                test: /\.(xls[a-z]?|doc[a-z]?)$/,
                type: "asset",
                generator: {
                    filename: "./files/[name].[ext]?[hash]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: "asset",
                generator: {
                    filename: "./fonts/[name].[ext]?[hash]"
                }
            },
            {
                // 引用的资源如果是  *.svg?url
                test: /\.svg$/,
                resourceQuery: /url/,
                // 以webpack的资源形式加载（普通资源文件、base64等）
                type: "asset"
            },
            {
                // 除了上面的匹配规则，我们都按照React组件来使用
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                resourceQuery: {not: [/url/]},
                use: ["@svgr/webpack"]
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        // 解决vender后面的hash每次都改变
        // new webpack.HashedModuleIdsPlugin(),
        new ProgressBarPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `${rootUrl}/static`),
                    to: path.resolve(__dirname, `${rootUrl}/dist`)
                },
                ...customCopyPlugin
            ]
        }),
        new NodePolyfillPlugin(),
    ], // 插件
    resolve: {
        // 省略后缀
        extensions: [".tsx", ".ts", ".js", ".jsx", ".d.ts", ".css", ".scss", ".less"]
    }
};
