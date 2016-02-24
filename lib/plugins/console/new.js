'use strict';

var tildify = require('tildify');
var chalk = require('chalk');
var tr = require('transliteration');

var reservedKeys = {
  _: true,
  title: true,
  layout: true,
  slug: true,
  path: true,
  replace: true,
  // Global options
  config: true,
  debug: true,
  safe: true,
  silent: true
};

function newConsole(args) {
  // Display help message if user didn't input any arguments
  if (!args._.length) {
    return this.call('help', {_: ['new']});
  }

  var data = {
    title: args._.pop(),
    layout: args._.length ? args._[0] : this.config.default_layout,
    slug: args.s || args.slug,
    path: args.p || args.path
  };

  // 中文标题转换为拼音
  data.slug = tr.slugify(data.title);

  var keys = Object.keys(args);
  var key = '';
  var self = this;

  for (var i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    if (!reservedKeys[key]) data[key] = args[key];
  }

  return this.post.create(data, args.r || args.replace).then(function(post) {
    self.log.info('Created: %s', chalk.magenta(tildify(post.path)));
  });
}

module.exports = newConsole;
