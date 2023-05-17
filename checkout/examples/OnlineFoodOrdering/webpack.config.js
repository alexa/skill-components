
const path = require('path');
	 
module.exports = {
    entry: './lambda/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    target: 'node',
    externals: [
        'aws-sdk'
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'lambda',
        libraryTarget: 'commonjs2'
    },
    optimization: {
        minimize: false
    }
};