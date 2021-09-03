const path = require('path');
const webpack = require('webpack');
const rootPath = process.cwd();
const context = path.join(rootPath, 'src');
const codecs = path.join(rootPath, 'codecs');
const outputPath = path.join(rootPath, 'examples', 'dist');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  context,
  entry: {
    cornerstoneWADOImageLoader: './imageLoader/index.js',
    cornerstoneWADOImageLoaderNoWebWorkers: './imageLoader/index-noWorkers.js',
    cornerstoneWADOImageLoaderWebWorker: './webWorker/index.worker.js',
  },
  target: 'web',
  output: {
    library: {
      name: '[name]',
      type: 'umd',
      umdNamedDefine: true,
    },
    globalObject: 'this',
    path: outputPath,
    clean: true,
  },
  devtool: 'source-map',
  externals: {
    'dicom-parser': {
      commonjs: 'dicom-parser',
      commonjs2: 'dicom-parser',
      amd: 'dicom-parser',
      root: 'dicomParser',
    },
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
  module: {
    noParse: [/(codecs)/],
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)|(codecs)/,
        loader: 'eslint-loader',
        options: {
          failOnError: false,
        },
      },
      {
        test: /\.wasm/,
        type: 'asset/resource',
      },
      /*{
        test: /\.worker\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: { inline: 'no-fallback' },
          },
          /*{
            loader: 'babel-loader',
          },
        ],
      },*/
      {
        test: /\.js$/,
        exclude: [/(node_modules)/, /(codecs)/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: path.join(codecs, 'jpeg.js'),
        use: 'exports-loader?JpegImage',
      },
    ],
  },
  plugins: [new webpack.ProgressPlugin()],
  // plugins: [new webpack.ProgressPlugin(), new BundleAnalyzerPlugin()],
};
