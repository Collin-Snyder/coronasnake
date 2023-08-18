const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: __dirname + "/client/src/index.jsx",
    plugins: [
      new HtmlWebpackPlugin({
        template: "client/src/index.html",
      }),
    ],
    module: {
      rules: [
        {
          test: [/\.jsx$|\.js$/],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"]
            }
          }
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: [/\.css$|\.scss$|\.sass$/],
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: [/\.(png|jpe?g|gif)$/i],
          use: ["file-loader"]
        }
      ]
    },
     output: {
      filename: "bundle.js",
      path: __dirname + "/public"
    }
  };
