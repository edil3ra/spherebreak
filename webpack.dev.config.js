const webpack = require('webpack')
const path = require("path")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pathToPhaser = path.join(__dirname, "/node_modules/phaser/")
const phaser = path.join(pathToPhaser, "dist/phaser.js")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        host: `localhost`,
        hot:true,
    },
    entry: {
        app: [
            path.resolve(__dirname, 'src/main.ts'),
        ],
        vendor: ['phaser'],
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            phaser: phaser,
            "~": path.resolve(__dirname, 'src'),
        }
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: {
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.json"
                },  
            },
            exclude: [
                path.resolve(__dirname, "typings"),
                path.resolve(__dirname, "node_modules")
            ],
        }, {
            test: /phaser\.js$/, loader: "expose-loader?Phaser"
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
                        sourceMap: true,
                    }
                }
            ]
        }]
    },
    optimization: {
        runtimeChunk: "single", // enable "runtime" chunk
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
            PLUGIN_FBINSTANT: JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            title: 'Spherebreak',
            template: 'src/index.ejs',
            filename: 'index.html',
            scriptLoading: 'defer',
        }),
        new webpack.EnvironmentPlugin({
            DEBUG: process.env.DEBUG || true
        }),
        new MiniCssExtractPlugin({filename: 'css/mystyles.css'}),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            port: 8888,
            openAnalyzer: false,
        }),
    ]
}
