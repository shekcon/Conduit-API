const router = require('express').Router();
const api = require('./api')

module.exports = router.use('/api', api);