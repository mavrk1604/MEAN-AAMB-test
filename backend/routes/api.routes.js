const express = require('express');
const router = express.Router();
const task = require('./task.routes')

router.use('/api', task)

module.exports = router
