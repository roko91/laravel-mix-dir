const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ignoredFiles = ['resources/js/client/app.js', 'resources/js/admin/app.js'];

mix.vue().webpackConfig({'plugins': [
  new webpack.IgnorePlugin({
    'resourceRegExp': /^\.\/locale$/,
    'contextRegExp': /moment$/
  })
]});

const mixDir = (method, source, output) => {
  source += (source.slice(-1) === '/' ? '' : '/');
  output += (output.slice(-1) === '/' ? '' : '/');
  fs.readdirSync(source).forEach(file => {
    const sourcePath = source + file;
    const sourceStat = fs.statSync(sourcePath);
    if (sourceStat.isDirectory()) {
      mixDir(method, sourcePath, output + file);
    } else if (!((method === 'sass' && file.startsWith('_')) || ignoredFiles.indexOf(sourcePath) > -1)) {
      if (file.split('.').pop().trim() === 'json') {
        mix.copy(sourcePath, output);
      } else if (!source.endsWith('/lib/')) {
        mix[method](sourcePath, output);
      }
    }
  });
};

module.exports = mixDir;
