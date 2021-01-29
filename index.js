const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

mix.vue().webpackConfig({'plugins': [
  new webpack.IgnorePlugin({
    'resourceRegExp': /^\.\/locale$/,
    'contextRegExp': /moment$/
  })
]});

const mixDir = (method, source, output, ignoredFiles = []) => {
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
        let outputPath = output + file;
        const extName = path.extname(outputPath);
        if (extName !== '.vue') {
            mix[method](sourcePath, output);
        }
      }
    }
  });
};

module.exports = mixDir;
