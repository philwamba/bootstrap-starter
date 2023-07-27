import webpack from 'webpack';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'css-minimizer-webpack-plugin';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (env, argv) => ({
    entry: ['./src/assets/scripts/main.js', './src/assets/styles/_main.scss'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        clean: true,
    },
    performance: {
        hints: false,
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    stats: {
        hash: false,
        version: false,
        timings: false,
        children: false,
        chunks: false,
        modules: false,
        source: false,
        publicPath: false,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: argv.mode === 'production' ? false : true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: argv.mode === 'production' ? false : true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: argv.mode === 'production' ? false : true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles/[name].css"
        }),
        new BrowserSyncPlugin({
            files: ['./*.html', './*.htm'],
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['./'] }
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets/images'), to: path.resolve(__dirname, 'dist/images') },
            ],
        }),
        // new ImageminPlugin({
        //     disable: argv.mode === 'production' ? false : true,
        //     test: /\.(jpe?g|png|gif|svg)$/i,
        //     cacheFolder: path.resolve(__dirname, '.cache'),
        //     pngquant: { quality: '90', speed: 4 },
        //     jpegtran: {},
        //     gifsicle: { optimizationLevel: 1 },
        //     svgo: {},
        //     plugins: [
        //         imageminMozjpeg({
        //             quality: 70,
        //             progressive: true,
        //         }),
        //     ],
        // }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
});
