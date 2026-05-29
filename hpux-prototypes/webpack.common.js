/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Dotenv from 'dotenv-webpack';
const BG_IMAGES_DIRNAME = 'bgimages';

/** Webpack asset `publicPath` (trailing slash). Hub embed overrides via env (see hub/scripts/build-hpux-prototypes-embed.mjs). */
function assetPublicPath() {
  const raw = process.env.ASSET_PATH;
  if (typeof raw === 'string' && raw.length > 0) {
    return raw.endsWith('/') ? raw : `${raw}/`;
  }
  return process.env.NODE_ENV === 'production' ? '/openshift-origin-design/hpux-prototypes/' : '/';
}

/** React Router basename: no trailing slash; empty string = site root (dev). Must match stripping in deepLinkUtils. */
function routerBasename(assetPath) {
  if (!assetPath || assetPath === '/') {
    return '';
  }
  return assetPath.replace(/\/$/, '');
}

export default (env) => {
  const ASSET_PATH = assetPublicPath();
  const ROUTER_BASENAME = routerBasename(ASSET_PATH);

  return {
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx)?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          type: 'asset/resource',
          // only process modules with this loader
          // if they live under a 'fonts' or 'pficon' directory
          include: [
            path.resolve('./node_modules/patternfly/dist/fonts'),
            path.resolve('./node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
            path.resolve('./node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
            path.resolve('./node_modules/@patternfly/patternfly/assets/fonts'),
            path.resolve('./node_modules/@patternfly/patternfly/assets/pficon'),
          ],
        },
        {
          test: /\.svg$/,
          type: 'asset/inline',
          include: (input) => input.indexOf('background-filter.svg') > 1,
          use: [
            {
              options: {
                limit: 5000,
                outputPath: 'svgs',
                name: '[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader if they live under a 'bgimages' directory
          // this is primarily useful when applying a CSS background using an SVG
          include: (input) => input.indexOf(BG_IMAGES_DIRNAME) > -1,
          type: 'asset/inline',
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader when they don't live under a 'bgimages',
          // 'fonts', or 'pficon' directory, those are handled with other loaders
          include: (input) =>
            input.indexOf(BG_IMAGES_DIRNAME) === -1 &&
            input.indexOf('fonts') === -1 &&
            input.indexOf('background-filter') === -1 &&
            input.indexOf('pficon') === -1,
          use: {
            loader: 'raw-loader',
            options: {},
          },
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            path.resolve('./src'),
            path.resolve('./node_modules/patternfly'),
            path.resolve('./node_modules/@patternfly/patternfly/assets/images'),
            path.resolve('./node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve('./node_modules/@patternfly/react-core/dist/styles/assets/images'),
            path.resolve('./node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve('./node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve('./node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css/assets/images')
          ],
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]',
          },
        },
      ],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve('./dist'),
      publicPath: ASSET_PATH,
    },
    plugins: [
      new webpack.DefinePlugin({
        __ROUTER_BASENAME__: JSON.stringify(ROUTER_BASENAME),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve('./src', 'index.html'),
        base: ASSET_PATH,
      }),
      new Dotenv({
        systemvars: true,
        silent: true,
      }),
      new CopyPlugin({
        patterns: [
          { from: './src/favicon.png', to: 'images' },
          { from: './src/404.html', to: '404.html' }
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve('./tsconfig.json'),
        }),
      ],
      symlinks: false,
      cacheWithContext: false,
    },
  };
};

