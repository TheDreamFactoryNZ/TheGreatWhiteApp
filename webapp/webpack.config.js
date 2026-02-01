const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { type } = require("os");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

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
        "@track-context": path.resolve(__dirname, "../core/context/TrackContext.js"),
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
    ],
  };
};
