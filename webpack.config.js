/**
 * @description webpack 开发环境配置
 *
 **/

'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin=require("html-webpack-plugin");

module.exports = {
    output: {
        filename  : 'assets/app.js',
        publicPath: "/"
    },
    cache  : true,
    debug  : true,
    devtool: 'eval-source-map',

    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8000',
        'webpack/hot/only-dev-server',
        './src/app/app.js'

    ],

    stats: {
        colors : true,
        reasons: true
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx', '.css']
    },

    module: {
        //preLoaders: [
        //    {
        //        test   : /\.(js|jsx)$/,
        //        exclude: /node_modules/,
        //        loader : 'eslint-loader'
        //    }
        //],

        loaders: [

            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : 'react-hot!babel-loader'
            }, {
                test  : /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test  : /\.(png|jpg|jpeg|ico|gif|woff|woff2|ttf|eot|svg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({template: 'src/index.html'})
    ]

};
