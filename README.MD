支持一下配置
1. 图片/视频/字体
2. css/scss/less
3. excel/word
4. json
5. js/es6等语法
6. ts
7. vue (准备去掉)
8. react
9. eslint
10. 热更新
11. 支持多入口和单入口
12. 懒加载 
13. alias (区分打包时的环境变量及一些别名)
14. 多入口 过滤 (只针对start服务时，原因是防止忘记关闭，导致build忘记打包)
---
待完善中

## 常见错误

#### 1. image-webpack-loader  一般出现单词类似 图片的这种报错，就重新这样装一下

需要用 cnpm 装

```javascript
npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm i image-webpack-loader
```

#### 2. 如果是多页面
> 新建的多页面，记得重启服务

#### 3. webpack-config.js的更改
> 更改完 需要重启服务

## 自定义功能

> 目前 支持 .eslintrc，tsconfig，.babelrc的自定义

> 和webpack-config.js  重点介绍

1. customEntry 自定义入口

```javascript
// 例如
customEntry: path.resolve(__dirname, "./src/modules/*/index.tsx"),
```

2. customCopyPlugin 自定义 copy文件
```javascript
// 例如
customCopyPlugin: [
    {
      from: path.resolve(__dirname, "./public"),
      to: path.resolve(__dirname, "./dist"),
    },
],
```
3. favicon 图标
这个 只需要把 favicon.ico 放到static文件夹根目录或者public文件夹根目录就可以

4. htmlChunk  这个里面暴露的主要是html页面相关的

* title对应的是 浏览器的头
* headChunk  meta的信息
* scriptChunk 就是js的script,可以放一些cdn网址
* $all 代表全部页面都通用
* index 代表只是index这个页面的东西，不会影响其它页面，如何里面只适用h5，则不会影响pc的头部，  或者引入了jquery，则不会污染其它页面  ** 注意这个index名字随意，但是要和入口文件夹一一对应**

```javascript
// 例如
    $all: {
        title: "huaxiang",
        headChunk: [
            `<meta charset="utf-8">`,
            `<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>`,
            `<meta name="format-detection" content="email=no">`,
            `<meta name="format-detection" content="telephone=no">`,
        ],
        scriptChunk:[
            `http://code.jquery.com/jquery-migrate-1.2.1.min.js`,
        ]
    },  
    index:{
        title: "huaxiang",
        headChunk: [
            `<meta charset="utf-8">`,
        ],
        scriptChunk:[
        ]
    }
```

5. server 就是启动服务时会使用的相关配置

* alias别名
* workPage 工作的文件夹
```JavaScript
// 这个workPage 如果用的好，可以提升工作效率，
// 下面的意思是说，只打包和index 相关的目录及依赖，其它页面不打包处理
// emm 不知道能不能懂，但是不好讲清楚

workPage:["index"],
```


6. build 就是打包时会使用的

比如 npm run build beta


```javascript
// 例如
beta: {
    alias: {
        "@": path.resolve(__dirname, "src"),
        env: path.resolve(__dirname, "env/beta.ts"),
    },
},
image: {
    alias: {
        "@": path.resolve(__dirname, "src"),
        env: path.resolve(__dirname, "env/image.ts"),
    },
},
prod: {
    alias: {
        "@": path.resolve(__dirname, "src"),
        env: path.resolve(__dirname, "env/prod.ts"),
    },
},
```

7. 是否启动图片压缩

```javascript
// 暂时 直接关掉，老是报包错误

// 默认不启动 false
isImageCompression:false,

```

8. 是否启动 start 性能调试
```javascript
// 默认不启动 false
isSpeedMeasurePlugin:false,
```

8. 是否启动 build 性能调试
```javascript
// 默认不启动 false
BundleAnalyzerPlugin:false,
```

### 启动
```
npm run start  //默认 8282

//可以这样
npm run start 8585  //后面端口随意
```

### 打包 
```
npm run build  //默认 beta

//可以这样
npm run build prod  //build后面随意
```

## 待解决 

略


## 备注

#### .prettierrc 

> 暂不启用

#### 默认隐藏 "image-webpack-loader": "^7.0.1",
> 指挥中心 加入这个插件，打包需要300多秒，去掉之后打包 30多秒............

#### 暂时未启动 HappyPack

> 效果不明显......，反而还慢了


#### 暂时 删除 image-webpack-loader
> 先删除把，包不好装，到时候等webpack5 稳定了，直接用webpack5的
