/**
 * Created by Administrator on 2016/12/9.
 */
var webpack=require("webpack");
var HtmlWebpackPlugin=require("html-webpack-plugin");
var ExtractTextPlugin=require("extract-text-webpack-plugin");

module.exports= {
    entry: __dirname + '/app/main.js',
    output:{
        path:__dirname + "/build",
        filename:"[name]-[hash].js"
    },
    module:{
        loaders:[
            {
                test:/\.json$/,
                loader:"json"
            },
            {
                test:/\.js$/,
                loader:"babel",
                exclude:"node_modules"
            },
            {
                test:/\.scss/,
                loader:ExtractTextPlugin.extract("style","css?module&localIdentName=[name]-[local]-[hash:base64:5]!sass!postcss")
                //sass?module!postcss 将css模块化，类名转hash防止全局命名冲突
            },
            {
                test: /\.(eot|svg|ttf|woff)\w*/,
                loader: 'file?limit=10240&name=fonts/[name].[hash:4].[ext]'
            },
            {
                test:/\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[name][hash:4].[ext]'
            }
        ]
    },
    postcss:[require('autoprefixer')], //调用autoprefixer插件
    plugins:[
        new webpack.BannerPlugin('Copyright Flying Ezhandi inc'),
        new HtmlWebpackPlugin({template:__dirname+"/app/templete/index.tmpl.html"}),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(), //优化模块ID
        new webpack.optimize.UglifyJsPlugin(), //压缩混淆JS插件
        new ExtractTextPlugin("[name]-[hash].css")
    ],
    devServer:{
        colors:true,
        inline:true,
        hot:true,
        historyApiFallback:true,
        host:'0.0.0.0'
    }
};