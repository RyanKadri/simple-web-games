const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = {
    devtool: 'source-map',
    entry: {
        viewer: './frontend/src/index.tsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist/frontend"),
        publicPath: "/",
    },
    plugins: [
        new CleanWebpackPlugin(["dist/frontend"] ),
        new HtmlWebpackPlugin({
            template: './frontend/src/index.html',
            meta: {
                charset: "UTF-8",
                viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            },
            hash: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    }
};

const dev = merge(common, {
    name: 'dev',
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        port: 3000,
        publicPath: `http://localhost:3000/`,
        historyApiFallback: true,
        host: '0.0.0.0',
        disableHostCheck: true
    },
    mode: 'development'
});

const prod = merge(common, {
    name: 'prod',
    plugins: [
        new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    ],
    mode: 'production'
});

module.exports = [
    dev,
    prod
];
