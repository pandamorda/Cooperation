const path = require("path");
const glob = require("glob");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");


///// PATHS /////

const ROOT = path.resolve(__dirname, "src/");
const BUILD_ROOT = path.resolve(__dirname, "dist/");

const ASSETS = "assets";
const IMAGES = "images";
const PAGES = "pages";
const STYLES = "styles";

const FAVICON = path.resolve(__dirname, 'favicon.ico');
const LOGO_ICON = path.resolve(__dirname, 'logo.png');

///// AUX /////

const isProduction = process.env.NODE_ENV == "production";
const filesPrefix = !isProduction ? "[name]." : "";


const getEntry = () => {
  const entry = { main: `${ROOT}/${PAGES}/index.js` };

  glob.sync(`${ROOT}/${PAGES}/*/index.js`).forEach((file) => {
    const name = file.match(/\/pages\/(.+)\/index.js/)[1];
    entry[name] = file;
  });

  return entry;
};

const getHtmlPlugins = () => glob
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


///// CONFIG /////

module.exports = {
  mode: isProduction ? "production" : "development",
  context: ROOT,
  entry: getEntry(),
  output: {
    path: BUILD_ROOT,
    filename: `js/${filesPrefix}[contenthash].js`,
    assetModuleFilename: `${ASSETS}/${filesPrefix}[contenthash].[ext]`,
    clean: true
  },
  devtool: 'source-map',
  devServer: {
    host: "localhost",
    port: 5051,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader", options: { cacheDirectory: true } }],
        resolve: { fullySpecified: false }
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /.(png|jp(e)?g|svg)$/i,
        type: 'asset',
        use: [{
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: { progressive: true },
            optipng: { enabled: true },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4
            },
            gifsicle: { interlaced: false },
            webp: { quality: 75 }
          }
        }],
        generator: { filename: `${ASSETS}/${IMAGES}/${filesPrefix}[hash].[ext]` }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: `${STYLES}/[contenthash].css` }),
    ...getHtmlPlugins()
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
    alias: {
      "@images": `${ROOT}/${ASSETS}/${IMAGES}/`,
      "@styles": `${ROOT}/${STYLES}/`,
      "@scripts": `${ROOT}/scripts/`,
      "@back_emu": `${ROOT}/back_emu/`,
      "@logo_icon": LOGO_ICON,
    }
  },
  optimization: {
    runtimeChunk: "single",
    usedExports: true,
    splitChunks: { chunks: "all" },
    minimizer: [new TerserWebpackPlugin({ parallel: true })]
  }
};
