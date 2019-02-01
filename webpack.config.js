
var path = require("path");
var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin")

var typeScriptRule = {
    test:/\.ts$/,
    loader:"ts-loader"
};

var pugRule = {
    test:/\.pug$/,
    loader: ['html-loader?attrs=false', 'pug-html-loader']
};

var resolvePath = (...args) => path.resolve(__dirname,...args)

module.exports = {
    entry: {
        main:"./src/main.ts",
        popup:"./src/popup.ts"
    },
    output: {
        filename: "[name].bundle.js",
        path: resolvePath(__dirname, 'dist','src')
    },
    resolve: { 
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module:{
        rules:[typeScriptRule,pugRule]
    },
    plugins:[
        new HtmlWebpackPlugin({
           filename: path.join(__dirname,"dist","popup.html"),
           template: "./src/popup.pug",
           inject:false,
           minify:false
        }) 
    ],
    devtool: 'cheap-module-source-map'
}