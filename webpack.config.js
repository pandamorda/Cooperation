const path = require("path");
const glob = require("glob");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssnanoPlugin = require("cssnano-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");


///// PATHS /////

const ASSETS = "assets";
const PAGES = "pages";
const ROOT = path.resolve(__dirname, "src/");
const FAVICON = "favicon.ico";
const BUILD_ROOT = path.resolve(__dirname, "dist/");

///// AUX /////

const isProduction = process.env.NODE_ENV == "production";
const prodFilePrefix = !isProduction ? "[name]." : "";


const getEntry = () => {
  const entry = {
    main: `${ROOT}/${PAGES}/index.js`
  };

  glob.sync(`${ROOT}/${PAGES}/*/index.js`).forEach((file) => {
    const name = file.match(/\/pages\/(.+)\/index.js/)[1];
    entry[name] = file;
  });

  return entry;
};

const getPlugins = () => {

  /// HTML PLUGINS ///

  const getHtmlPlugins = () => {
    const htmlPlugins = glob
      .sync(`${ROOT}/${PAGES}/*/index.html`)
      .map((file) => {
        const name = file.match(/\/pages\/(.+)\/index.html/)[1];
        return new HtmlWebpackPlugin({
          template: file,
          chunks: [name],
          filename: `${PAGES}/${name}/index.html`,
          favicon: FAVICON
        });
      })
      .concat(
        new HtmlWebpackPlugin({
          template: `${PAGES}/index.html`,
          filename: "index.html",
          favicon: FAVICON
        })
      );

    return htmlPlugins;
  };


  const plugins = [new CleanWebpackPlugin(), ...getHtmlPlugins()];

  if (isProduction) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: "styles/[contenthash].css"
      })
    );
  }
  return plugins;
};


///// CONFIG /////

module.exports = {
  mode: isProduction ? "production" : "development",
  context: ROOT,
  entry: getEntry(),
  output: {
    path: BUILD_ROOT,
    filename: `js/${prodFilePrefix}[contenthash].js`,
    assetModuleFilename: `${ASSETS}/${prodFilePrefix}[contenthash].[ext]`
  },
  devServer: {
    host: "localhost",
    port: 5051,
    hot: !isProduction,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader"
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  plugins: getPlugins(),
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
    alias: {
      "@images": `${ROOT}/${ASSETS}/images/`,
      "@styles": `${ROOT}/styles/`,
      "@scripts": `${ROOT}/scripts/`,
      "@back_emu": `${ROOT}/back_emu/`,
    }
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all"
    },
    minimizer: [
      new CssnanoPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 10 }],
              ["svgo", { plugins: [{ name: "preset-default" }] }]
            ]
          }
        }
      })
    ]
  }
};
