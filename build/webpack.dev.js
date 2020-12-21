const merge = require("webpack-merge");
const common = require("./webpack.base.js");
const path = require("path");
const webpack = require("webpack");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const entry = require("../utils/server-entry");
const { rootUrl } = require("../utils/global");
const { isSpeedMeasurePlugin } = require(`${rootUrl}/.compile`);
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const HappyPack = require("happypack");
const os = require("os");
// 开辟一个线程池
// 拿到系统CPU的最大核数，happypack 将编译工作灌满所有线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const devWebpackConfig = merge(common, {
    entry,
    mode: "development",
    // devtool: "inline-source-map", //追踪到错误和警告在源代码中的原始位置
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                use: [
                    // 'happypack/loader?id=js',
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            plugins: [require.resolve("react-refresh/babel")],
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "async", //async异步代码分割 initial同步代码分割 all同步异步分割都开启
            minSize: 20000, //字节 引入的文件大于30kb才进行分割
            // minRemainingSize: 0, webpack4.0运行报错，适用webpack5.0具体看官方
            maxSize: 0,
            minChunks: 1, //模块至少使用次数
            maxAsyncRequests: 30, //同时加载的模块数量最多是30个，只分割出同时引入的前30个文件
            maxInitialRequests: 30, //首页加载的时候引入的文件最多30个
            automaticNameDelimiter: "~", //缓存组和生成文件名称之间的连接符
            enforceSizeThreshold: 50000,
            cacheGroups: {
                //缓存组，将所有加载模块放在缓存里面一起分割打包
                defaultVendors: {
                    //自定义打包模块
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, //优先级，先打包到哪个组里面，值越大，优先级越高
                    reuseExistingChunk: true,
                },
                default: {
                    //默认打包模块
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true, //模块嵌套引入时，判断是否复用已经被打包的模块
                },
            },
        },
        minimize: false,
        
    },
    plugins: [
        // 开启全局的模块热替换(HMR)
        new webpack.HotModuleReplacementPlugin(),
        // 插件的作用是在热加载时直接返回更新文件名，而不是文件的id
        new webpack.NamedModulesPlugin(),
        // new HappyPack({
        //     id: 'js',
        //     threadPool: happyThreadPool,
        //     loaders: [
        //         {
        //             loader: 'babel-loader',
        //             options: {
        //                 cacheDirectory: true,
        //                 plugins: [require.resolve("react-refresh/babel")],
        //             },
        //         },
        //     ],
        // }),
        // 官方热更新
        new ReactRefreshPlugin(),
        new ForkTsCheckerWebpackPlugin({
            // 将async设为false，可以阻止Webpack的emit以等待类型检查器/linter，并向Webpack的编译添加错误。
            async: false,
        }),
        // 将TypeScript类型检查错误以弹框提示
        // 如果fork-ts-checker-webpack-plugin的async为false时可以不用
        // 否则建议使用，以方便发现错误
        // new ForkTsCheckerNotifierWebpackPlugin({
        //   title: "TypeScript",
        //   excludeWarnings: true,
        //   skipSuccessful: true,
        // }),
    ],
});

module.exports = isSpeedMeasurePlugin?smp.wrap(devWebpackConfig):devWebpackConfig;
