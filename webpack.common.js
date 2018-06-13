const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets'
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            apiServer: config['api_server'],
            ssoServer: config['sso_server'],
            ssoClientID: config['sso_client_id'],
            entryServer: config['entry_server'],
            logServer: config['log_server']
        }),
    ],
    output: {
        filename: 'assets/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }
}
