'use strict';

const path = require('path');
const globule = require('globule');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const targetTypes = { ejs: 'html', js: 'js' };

const getEntriesList = (targetTypes, cssName) => {
  const entriesList = {};
  for(const [ srcType, targetType ] of Object.entries(targetTypes)) {
    const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`, `!**/module/*.${srcType}`, `!**/router/*.${srcType}`, `!**/store/*.${srcType}`], { cwd : `${__dirname}/src/` });
    for(const srcName of filesMatched) {
      const targetName = srcName.replace('ejs/', '').replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
      entriesList[targetName] = `${__dirname}/src/${srcName}`;
    }
  }
  if (cssName) {
    entriesList[cssName] = `${__dirname}/src/${cssName}`;
  }
  return entriesList;
}

const templateFunction = (data) => {
  const perSprite = data.sprites.map((sprite) => {
    const $name = sprite.name,
      $width = sprite.width,
      $height = sprite.height,
      $ofx = sprite.offset_x,
      $ofy = sprite.offset_y,
      $tw = sprite.total_width,
      $th = sprite.total_height;
    return '$N-name: \'N\';\n$N-x: Xpx;\n$N-y: Ypx;\n$N-offset-x: Xpx;\n$N-offset-y: Ypx;\n$N-width: Wpx;\n$N-height: Hpx;\n$N-total-width: Mpx;\n$N-total-height: Lpx;\n$N-image: \'I\';'
      .replace(/N/g, $name)
      .replace(/X/g, $ofx)
      .replace(/Y/g, $ofy)
      .replace(/W/g, $width)
      .replace(/H/g, $height)
      .replace(/M/g, $tw)
      .replace(/L/g, $th)
      .replace(/I/g, data.sprites[0].image);
  }).join('\n');
  return perSprite;
};

const config = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  entry: getEntriesList(targetTypes, 'css/main.css'),
  devtool: IS_PRODUCTION ? 'none' : 'source-map',
  output: {
    filename: '[name]',
    path: path.resolve(__dirname + '/dist/')
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false
            }
          },
          {
            loader: 'ejs-html-loader',
            options: {
              data: require(`${__dirname}/src/ejs/data/data.json`)
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                'targets': {
                  'browsers': ['last 2 versions', 'IE 11']
                }
              }]
            ]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          publicPath: '../',
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  require('postcss-import')(),
                  require('postcss-nested')(),
                  require('postcss-mixins')(),
                  require('postcss-extend')(),
                  require('postcss-color-function')(),
                  require('postcss-simple-vars')(),
                  require('postcss-calc')(),
                  require('autoprefixer')({
                    browsers: [
                      'ie >= 9',
                      'iOS >= 7',
                      'Android >= 4.1',
                      'last 1 ChromeAndroid versions',
                      'last 2 versions'
                    ]
                  }),
                  // require('cssnano')()
                ],
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: path.resolve(__dirname, 'src/img'),
        use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                // outputPath: './img/',
                useRelativePath: true,
                publicPath: ''
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                gifsicle: {
                  interlaced: false,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: "65-90",
                  speed: 4
                },
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                svgo: {
                  plugins: [
                    {
                      removeViewBox: false
                    },
                    {
                      removeEmptyAttrs: false
                    }
                  ]
                }
              }
            }
          ],
          exclude: [/node_modules/, path.resolve(__dirname, 'src/svg/')]
      },
      // {
      //   test: /\.(jpe?g|png|gif|ico)(\?.+)?$/,
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       limit: 8192,
      //       name: './img/[name].[ext]'
      //     }
      //   }
      // },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: svgPath => `svg/sprite${svgPath.substr(-4)}`
        },
        exclude: [/node_modules/, path.resolve(__dirname, 'src/img/')]
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: 'js/vendor.js',
      chunks: 'initial',
    }
  },
  resolve: {
    modules: ['node_modules', 'sprite'],
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    // new CopyWebpackPlugin(
    //   [{ from: `${__dirname}/src` }],
    //   { ignore: Object.keys({ ejs: 'html', js: 'js', css: 'css', svg: 'svg', DS_Store: 'DS_Store' }).map((ext) => `*.${ext}`) }
    // ),
    new VueLoaderPlugin(),
    new ExtractTextPlugin({
      filename: 'css/main.css',
    }),
    new SpriteLoaderPlugin({
      plainSprite: true
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, 'src/img/sprite'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, 'src/img/sprite.png'),
        css: [
          [
            path.resolve(__dirname, 'src/css/foundation/_sprite.css'),
            {
              format: 'function_based_template'
            }
          ]
        ]
      },
      customTemplates: {
        'function_based_template': templateFunction
      },
      apiOptions: {
        cssImageRef: '../img/sprite.png'
      },
      spritesmithOptions: {
        padding: 4
      }
    }),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    open: true,
    inline: true
  },
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 400000
  }
};

for(const [ targetName, srcName ] of Object.entries(getEntriesList({ ejs: 'html' }))) {
  config.plugins.push(new HtmlWebpackPlugin({
    filename: targetName,
    template: srcName
  }));
}

module.exports = config;
