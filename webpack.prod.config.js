const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pathToPhaser = path.join(__dirname, "/node_modules/phaser/")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const phaser = path.join(pathToPhaser, "dist/phaser.js")


module.exports = {
    mode: 'production',
    entry: {
        'js/app': [
            path.resolve(__dirname, 'src/main.ts')
        ],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            phaser: phaser,
            "~": path.resolve(__dirname, 'src'),
        }
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: {
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.json"
                },  
            },
            exclude: [
                path.resolve(__dirname, "typings"),
                path.resolve(__dirname, "node_modules"),
            ],
        }, {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                    }
                }
            ]
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                'js/vendor': {
                    test: /[\\/]node_modules[\\/]/,
                    name: "js/vendor",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Spherebreak',
            template: 'src/index.ejs',
            filename: 'index.html',
            scriptLoading: 'defer',
        }),
        new webpack.EnvironmentPlugin({
            DEBUG: process.env.DEBUG || false
        }),
        new MiniCssExtractPlugin({filename: 'css/mystyles.css'}),
    ]
}
