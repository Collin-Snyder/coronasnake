module.exports = {
    entry: __dirname + "/client/src/index.jsx",
    module: {
      rules: [
        {
          test: [/\.jsx$|\.js$|\.html$/],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"]
            }
          }
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
      path: __dirname + "/client/dist"
    }
  };
