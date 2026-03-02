const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { type } = require("os");
const dotenv = require("dotenv");
const webpack = require("webpack");

// Load env from webapp/.env.local
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config();

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";
  const rawDebug = process.env.GW_DEBUG;
  const hasRaw = rawDebug !== undefined && rawDebug !== '';
  const norm = hasRaw ? String(rawDebug).toLowerCase().trim() : undefined;
  const debugFlag = hasRaw ? (norm === '1' || norm === 'true') : isDev;

  const appVariant =
    env.REACT_APP_VARIANT ||
    env.APP_VARIANT ||
    process.env.REACT_APP_VARIANT ||
    process.env.APP_VARIANT ||
    'webapp'

  return {
    entry: path.resolve(__dirname, "../core/index.jsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
      publicPath: '/',
      clean: true, // Cleans the output directory before building
    },
    mode: isDev ? "development" : "production",
    devtool: isDev ? "inline-source-map" : "source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      hot: true,
      open: true,
      port: 3000,
      historyApiFallback: true, // Ensures React Router works
    },
    resolve: {
      extensions: [".js", ".jsx"],
      modules: [path.resolve(__dirname, "../node_modules"), 'node_modules'], // Prefer workspace root node_modules to unify React
      alias: {
        react: path.resolve(__dirname, "../node_modules/react"),
        "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
        "@core": path.resolve(__dirname, "../core"),
        '@components': path.resolve(__dirname, '../core/components'),
        '@buttons': path.resolve(__dirname, '../core/components/buttons'),
        '@assets': path.resolve(__dirname, '../core/assets'),
        '@images': path.resolve(__dirname, '../core/assets/images'),
        "@contexts": path.resolve(__dirname, "../core/contexts/"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              configFile: path.resolve(__dirname, "babel.config.js"),
            },
          },
        },
        {
          test: /\.module\.css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                esModule: false,
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          exclude: /\.module\.css$/i,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                // Use CommonJS-style export to avoid ESM/CJS interop issues
                esModule: false,
                sourceMap: true,
                modules: false
              }
            }
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|otf)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext]",
          }
        },
        {
          test: /\.svg$/i,
          oneOf: [
            {
              issuer: /\.[jt]sx?$/,
              resourceQuery: [/component/, /react/], // make svg a react component if ?component or ?react is used
              use: [{ loader: '@svgr/webpack', options: { exportType: 'default' } }],
            },
            {
              resourceQuery: /url/, // *.svg?url 
              type: 'asset/resource',
              generator: {
                filename: "assets/[name][ext]",
              },
            },
            {
              type: 'asset/resource',
              generator: {
                filename: "assets/[name][ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new webpack.DefinePlugin({
        __MAPBOX_TOKEN__: JSON.stringify(process.env.MAPBOX_TOKEN ?? ""),
        __GW_DEBUG__: JSON.stringify(!!debugFlag),
        __REACT_APP_VARIANT__: JSON.stringify(appVariant),
      }),
    ],
  };
};
