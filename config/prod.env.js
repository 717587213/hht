'use strict'
const axios = require('axios')

let HOST = JSON.parse(process.env.npm_config_argv).original[3] || 'test';

module.exports = {
  NODE_ENV: '"production"',
  HOST: '"'+HOST+'"'
}