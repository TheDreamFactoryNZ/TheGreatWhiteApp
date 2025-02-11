const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    entry: "../core/index.jsx",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
      clean: true, // Cleans the output directory before building
    },
    mode: isDev ? "development" : "production",
    devtool: isDev ? "inline-source-map" : "source-map",
    devServer: {
      static: path.join(__dirname, "public"),
      hot: true,
      open: true,
      port: 3000,
      historyApiFallback: true, // Ensures React Router works
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'], // Compile modules from this directory instead of core
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "build", "public"),
            globOptions: {
              ignore: ["**/index.html"], // Prevents overwriting HtmlWebpackPlugin
            },
          },
        ],
      }),
    ],
  };
};
