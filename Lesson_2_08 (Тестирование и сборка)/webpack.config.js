module.exports = {
    entry: './front/front_script.js',
    // entry: '.front/src/main.js',
    mode: 'development',
    output: {
      filename: './front_build.js'
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.vue$/,
    //       loader: 'vue-loader'
    //     }, {
    //      test: /\.css$/,
    //      use: [
    //        'vue-style-loader',
    //        'css-loader'
    //      ]
    //    }
    //   ]
    // },
    // plugins: [
    //    new VueLoaderPlugin()
    //   ]
}

// module.exports = {
//   entry: './test/script',
//   mode: 'development',
//   output: {
//     filename: './build.js'
//   }
// }
  