
const express = require('express');
const router = express.Router();
const SystemModule = require('../core/system');

router.get('/stats', (req, res) => {
    res.json(SystemModule.getStats());
});

module.exports = router;
