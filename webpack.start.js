var path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin');plugins: [
//     new UglifyJsPlugin({
//         output: {
//             comments: false,
//         },
//         compress: {
//             warnings: false
//         }
//         })
//   ]

// const glob = require('glob') //动态获取入口文件
// const getEntries = () => {
//     let obj = {};
//     glob.sync(path.join(__dirname, './pages/*'), {}).forEach(item => {
//         obj[`${item.split('/').pop()}`] = `${item}/index.js`
//     })
//     return obj
// }

/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
*/
var HtmlWebpackPlugin = require('html-webpack-plugin');

new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: JSON.stringify("development")
    }
});
const webpackConfig = module.exports = {
    devtool: 'cheap-module-eval-source-map',
    //使用webpack-dev-server，提高开发效率
    devServer: {
        // contentBase: './',//resource not through webpack
        contentBase: path.join(__dirname, 'dist'),
        host: 'localhost',
        port: 8083,
        inline: true,
        hot: true,
        hotOnly: true,
        compress: true, // enable gzip compression
        // https: false,
        // historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    },
    entry: {
        //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出,比如下面数组里面的js,全部压缩在了vendor这个文件这里
        vendor: ['react', 'react-dom'],
        // vendor: ['react', 'react-dom', 'react-tappable', 'underscore', 'react-router', 'dva'],
        app: ['./src/index.js'],
    },

    output: {
        path: path.join(__dirname, 'dist'), //出口文件，生成一个dist文件，打包后的文件都在这里里面
        // publicPath: './',
        // publicPath: '/dist/',
        // filename: 'js/[name].bundle.js',
        filename: process.env.NODE_ENV === 'production' ? '[name].[chunkhash:8].js' : '[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    module: {
        loaders: [
            { // es6转为es5
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                // options: {
                //     presets: ['es2015', 'react']
                // }
            },
            // { //加载器，加载各个加载器的配置
            //     test: /\.js$/,
            //     // loaders: ['react-hot-loader', 'babel-loader'],
            //     loader: 'babel-loader',
            //     include: [path.join(__dirname, 'render'), path.join(__dirname, 'component')]
            //     // include: [path.join(__dirname, 'component')]
            // },
            {
                test: /\.(css)$/,
                //配置css的抽取器、加载器。'-loader'可以省去  !!!但据说webpack3不能省去
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                // modules: true,
                                // localIdentName: '[name]__[local]--[hash:base64:5]',
                                // url: false,// true!!!!否则引用字体等不打包
                                sourceMap: true,minimize: true
                                }
                            },
                        //     {
                        //     loader: 'postcss-loader', // 浏览器兼容等
                        //     options: {
                        //          minimize: true, //css压缩
                        //          plugins: [
                        //              require("autoprefixer")({browserslist: ["last 3 versions"]})
                        //          ]
                        //     }
                        // }
                        ]
                    })
                // loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                //配置less的抽取器、加载器。中间!有必要解释一下，
                //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
                //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                // url: false,
                                sourceMap: true,minimize: true
                                }
                        },{
                            loader: 'less-loader',
                            options:{
                                // relativeUrls: false,
                                sourceMap: true}
                        }]
                    })
            },
            {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: "html-loader?attrs=img:src img:data-src"
            },
            {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                use: [{
                    loader:'file-loader',
                    options: {
                        name: '[name].[hash:5].[ext]',
                        outputPath: './fonts/'
                    }
                }]
            },
            {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|svg|jpg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            },
            // {
            //     test: /\.png$/,
            //     loader: 'url-loader?limit=1000&mimetype&name=./images/[name].[ext]',
            // },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader?sourceMap'
            }
        ]
    },



    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: 'jquery'
            //,jQuery: 'jquery'
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),//热加载
        new ExtractTextPlugin(
            // 'css/[name].css'
            '[name].css'
        ), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'], // 配置boot防止 影响其他不变的文件也改变hash值；将公共模块提取，生成名为`vendors`的chunk.就是将vendor里面的文件压缩成一个文件
            filename: '[name].js',
            // chunks: ['react','react-dom','jquery','react-tappable','underscore','react-router'], 
            //chunks 提取哪些模块共有的部分,跟vendor是一样的
            minChunks: Infinity // 提取至少*个模块共有的部分
        }),

        //将html打包压缩
        new HtmlWebpackPlugin({ // 模板生成相关的配置，每个对于一个页面的配置，有几个写几个
            //favicon: './images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            title: 'page',
            // chunks: ['boot','vender','common','global',page.outputPath],
            filename: 'index.html',//'view/index.html',//page.outputPath + '.html',//生成的html存放路径，相对于 path
            template: 'src/index.ejs', //html模板路径
            inject: true, //true同body 允许插件修改哪些内容，包括head与body js插入的位置，true/'head'/'body'/false
            hash: true,//为静态资源生成hash值，可以实现缓存
            chunksSortMode: 'dependency'
        }),
        new webpack.NamedModulesPlugin()
    ],
    //externals: {},


};