const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
const { exec } = require('child_process')

class WebAssemblyHotRebuildPlugin {
    dirPath = path.resolve(__dirname, 'src', 'webAssembly')
    command = 'echo "command not set"'

    constructor(dirPath, command) {
        this.dirPath = dirPath
        this.command = command
    }

    apply(compiler) {
        const that = this
        compiler.hooks.watchRun.tap(WebAssemblyHotRebuildPlugin.constructor.name, (comp) => {
            if (comp.modifiedFiles) {
                const changedFiles = Array.from(comp.modifiedFiles)
                if (changedFiles.includes(that.dirPath)) {
                    console.log('REBUILDING... wasm files')
                    exec(that.command, console.log)
                }
            }
        })

        compiler.hooks.environment.tap(WebAssemblyHotRebuildPlugin.constructor.name, () => {
            console.log('BUILDING... wasm files')
            exec(that.command, console.log)
        })
    }
}
  

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        publicPath: './'
    },
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, './build'),
        // open: true,
        hot: true,
        hotOnly: true,
        filename: '/build/index.html',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', 'jsx', 'json'],
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                loader: 'webassembly-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ico$/,
                loader: 'url',
            },
            {
                test: /\.(jpg|gif|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
        ]
    },
    plugins: [
        new WebAssemblyHotRebuildPlugin(
            path.resolve(__dirname, 'src', 'webAssembly'),
            'npm run build:wasm'
        ),
        new ExtraWatchWebpackPlugin({
            dirs: [
                path.resolve(__dirname, 'src', 'webAssembly')
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: './',
                    from: 'public',
                    to: './',
                    noErrorOnMissing: true,
                    globOptions: {
                        dot: true,
                        ignore: [
                            '**/index.html'
                        ]
                    }
                },
            ],
        })
    ],
    experiments: {
        asyncWebAssembly: true
    }
}